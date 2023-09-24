package deployer

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"souin_middleware/pkg/api"
	"strings"
	"text/template"
)

func formatSubDomains(subs map[string]api.Configuration) string {
	orderedByIP := make(map[string][]string)

	for subName, sub := range subs {
		if val, ok := orderedByIP[sub.IP]; !ok || len(val) == 0 {
			orderedByIP[sub.IP] = []string{subName}
			continue
		}
		orderedByIP[sub.IP] = append(orderedByIP[sub.IP], subName)
	}

	formatedSubdomains := ""
	for ip, sub := range orderedByIP {
		formatedSubdomains += `\"` + ip + `\": [\"` + strings.Join(sub, `\",\"`) + `\"],`
	}

	return "{" + strings.TrimSuffix(formatedSubdomains, ",") + "}"
}

func (d *deployer) insertTask(domain string, subs map[string]api.Configuration) error {
	tpl, err := template.New("createTaskPayload").Parse(createTaskPayloadTemplate)
	if err != nil {
		return err
	}

	subsString, _ := json.Marshal(subs)

	var buf bytes.Buffer
	tpl.Execute(&buf, createTaskPayload{
		ProjectId:     d.projectId,
		TemplateId:    d.templateId,
		Name:          strings.ReplaceAll(domain, ".", "_"),
		Domain:        domain,
		Subdomains:    formatSubDomains(subs),
		Configuration: string(subsString),
	})
	fmt.Println(buf.String())
	rq, err := d.getAuthRequest("/project/"+d.projectId+"/tasks", http.MethodPost, &buf)
	if err != nil {
		return err
	}

	var res *http.Response
	res, err = http.DefaultClient.Do(rq)
	if err != nil {
		return err
	}

	if res.StatusCode != http.StatusCreated {
		fmt.Printf("%#v\n", res)
		return errors.New("impossible to create the task")
	}

	return nil
}

func (d *deployer) createAndRunTask(domain string, subs map[string]api.Configuration) error {
	return d.insertTask(domain, subs)
}
