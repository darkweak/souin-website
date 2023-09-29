package pkg

import (
	"bytes"
	"context"
	"io"
	"net/http"
	"souin_middleware/pkg/deployer"
	"sync"
	"time"

	"go.uber.org/zap"
)

type CheckerChain struct {
	Map *sync.Map
	logger *zap.Logger
	cancel context.CancelFunc
	ctx    context.Context
}

func NewCheckerChain(logger *zap.Logger) *CheckerChain {
	return &CheckerChain{
		Map:    &sync.Map{},
		logger: logger,
	}
}

func isDomainValid(dns string, client httpClient, l *zap.Logger) bool {
	l.Sugar().Debugf("Try to validate %s", dns)
	res, err := client.Get("http://" + dns + "/souin-healthcheck")
	if err != nil || res == nil || res.Body == nil || res.StatusCode != http.StatusOK {
		l.Sugar().Debugf("The DNS %s didn't returned a valid response %+v", dns, err)
		return false
	}

	body := bytes.NewBuffer([]byte{})
	_, err = io.Copy(body, res.Body)

	value := err == nil && body.String() == "OK"

	if value {
		l.Sugar().Debugf("The DNS %s has been validated", dns)
	} else {
		l.Sugar().Debugf("The DNS %s cannot be validated %+v: %+v", dns, body.String(), err)
	}

	return value
}

type domain struct {
	id   string
	dns  string
	subs map[string]string
}

func (d *domain) Contains(zone string) bool {
	for _, sub := range d.subs {
		if sub == zone {
			return true
		}
	}

	return false
}

func (c *CheckerChain) Add(id, dns, sub, ip string) {
	c.logger.Sugar().Debugf("Try to add %s {dns: %s, sub: %s, ip: %s} to the checker loop", id, dns, sub, ip)
	d, b := c.Map.LoadOrStore(id, &domain{id: id, dns: dns, subs: map[string]string{sub: ip}})
	if b {
		if _, ok := d.(*domain).subs[sub]; sub != "" && !ok {
			d.(*domain).subs[sub] = ip
		}
	}
	c.Map.Store(id, d)

	if c.cancel == nil {
		c.ctx, c.cancel = context.WithCancel(context.Background())
		go func(checker *CheckerChain) {
			c.logger.Debug("Start the checker loop")
			for {
				select {
				case <-checker.ctx.Done():
					return
				default:
					c.Map.Range(func(key, value any) bool {
						go func(dom *domain) {
							if isDomainValid(dom.dns, getHTTPClient(), c.logger) {
								subs := validateDomain(dom.id)
								deployer.Deploy(dom.dns, subs, c.logger)
								if err := deployer.Deploy(dom.dns, subs, c.logger); err != nil {
									c.logger.Sugar().Errorf("%#v", err)
									return
								}
								c.Del(dom.dns)

								return
							}

							for sub := range dom.subs {
								if sub != "" && isDomainValid(sub+"."+dom.dns, getHTTPClient(), c.logger) {
									subs := validateDomain(dom.id)
									if err := deployer.Deploy(dom.dns, subs, c.logger); err != nil {
										c.logger.Sugar().Errorf("%#v", err)
										return
									}
									
									c.Del(dom.id)
									return
								}
							}
						}(value.(*domain))

						return true
					})
				}

				time.Sleep(10 * time.Second)
			}
		}(c)
	}
}

func (c *CheckerChain) Del(dns string) {
	c.logger.Sugar().Infof("Try to delete %s", dns)
	c.Map.Delete(dns)
	hasItem := false
	c.Map.Range(func(key, value any) bool {
		hasItem = true
		return false
	})

	if !hasItem {
		c.logger.Debug("Stop the checker loop")
		if c.cancel != nil {
			c.cancel()
			c.cancel = nil
		}
	}
}
