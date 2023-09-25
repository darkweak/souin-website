package deployer

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"souin_middleware/pkg/api"
	"strings"
	"text/template"
)

func getEscapedEnvironment(domain string, subs map[string]api.Configuration) string {
	for i, c := range subs {
		var config map[string]interface{}
		if json.Unmarshal([]byte(c.Configuration), &config) == nil {
			sub := subs[i]
			sub.Configuration = getCaddyfileValues(config)
			subs[i] = sub
		}
	}

	environment, _ := json.Marshal(Environment{
		Cd: domain,
		Config: "/tmp/semaphore/ansible.cfg",
		Configuration: subs,
		Kc: "False",
		Label: strings.ReplaceAll(domain, ".", "_"),
	})

	environment, _ = json.Marshal(string(environment))

	return string(environment)
}

type Environment struct {
	Cd string `json:"CURRENT_DOMAIN"`
	Config string `json:"ANSIBLE_CONFIG"`
	Configuration map[string]api.Configuration `json:"CONFIGURATION"`
	Kc string `json:"ANSIBLE_HOST_KEY_CHECKING"`
	Label string `json:"LABEL"`
}

func (d *deployer) insertTask(domain string, subs map[string]api.Configuration) error {
	tpl, err := template.New("createTaskPayload").Parse(createTaskPayloadTemplate)
	if err != nil {
		return err
	}

	var buf bytes.Buffer
	tpl.Execute(&buf, createTaskPayload{
		ProjectId:     d.projectId,
		TemplateId:    d.templateId,
		Environment:   getEscapedEnvironment(domain, subs),
	})
	d.logger.Debug(buf.String())
	rq, err := d.getAuthRequest("/project/"+d.projectId+"/tasks", http.MethodPost, &buf)
	if err != nil {
		return err
	}

	var res *http.Response
	res, err = http.DefaultClient.Do(rq)
	if err != nil {
		return err
	}

	d.logger.Sugar().Debugf("%#v", res)
	if res.StatusCode != http.StatusCreated {
		return errors.New("impossible to create the task")
	}

	return nil
}

func (d *deployer) createAndRunTask(domain string, subs map[string]api.Configuration) error {
	return d.insertTask(domain, subs)
}
