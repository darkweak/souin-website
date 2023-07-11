package deployer

import (
	"bytes"
	"errors"
	"net/http"
	"strings"
	"text/template"
)

func formatSubDomains(subs map[string]string) string {
	orderedByIP := make(map[string][]string)

	for sub, ip := range subs {
		if val, ok := orderedByIP[ip]; !ok || len(val) == 0 {
			orderedByIP[ip] = []string{sub}
			continue
		}
		orderedByIP[ip] = append(orderedByIP[ip], sub)
	}

	formatedSubdomains := ""
	for ip, sub := range orderedByIP {
		formatedSubdomains += `\"` + ip + `\": [\"` + strings.Join(sub, `\",\"`) + `\"],`
	}

	return "{" + strings.TrimSuffix(formatedSubdomains, ",") + "}"
}

func (d *deployer) insertTask(domain string, subs map[string]string) error {
	tpl, err := template.New("createTaskPayload").Parse(createTaskPayloadTemplate)
	if err != nil {
		return err
	}

	var buf bytes.Buffer
	tpl.Execute(&buf, createTaskPayload{
		ProjectId:  d.projectId,
		TemplateId: d.templateId,
		Name:       strings.ReplaceAll(domain, ".", "_"),
		Domain:     domain,
		Subdomains: formatSubDomains(subs),
	})
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
		return errors.New("impossible to create the task")
	}

	return nil
}

func (d *deployer) createAndRunTask(domain string, subs map[string]string) error {
	return d.insertTask(domain, subs)
}
