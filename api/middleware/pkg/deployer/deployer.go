package deployer

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
)

const (
	ENV_SEMAPHORE_URL      = "SEMAPHORE_URL"
	ENV_SEMAPHORE_USERNAME = "SEMAPHORE_USERNAME"
	ENV_SEMAPHORE_PASSWORD = "SEMAPHORE_PASSWORD"

	ENV_PROJECT_ID  = "PROJECT_ID"
	ENV_TEMPLATE_ID = "TEMPLATE_ID"
)

var (
	semaphoreURL      = os.Getenv(ENV_SEMAPHORE_URL)
	semaphoreUsername = os.Getenv(ENV_SEMAPHORE_USERNAME)
	semaphorePassword = os.Getenv(ENV_SEMAPHORE_PASSWORD)
)

type deployer struct {
	token      string
	projectId  string
	templateId string
}

func newDeployer() *deployer {
	return new(deployer)
}

func (d *deployer) login() error {
	rq, err := http.NewRequest(
		http.MethodPost,
		semaphoreURL+"/api/auth/login",
		bytes.NewBuffer([]byte(fmt.Sprintf(`{"auth": "%s", "password": "%s"}`, semaphoreUsername, semaphorePassword))),
	)
	if err != nil {
		return err
	}

	rq.Header.Set("Accept", "application/json")
	rq.Header.Set("Content-Type", "application/json")
	res, err := http.DefaultClient.Do(rq)
	if err != nil {
		return err
	}

	if res == nil || len(res.Cookies()) == 0 || res.Cookies()[0] == nil {
		return errors.New("impossible to extract the token")
	}

	d.token = res.Cookies()[0].Value

	return nil
}

func (d *deployer) getAuthRequest(endpoint, method string, body io.Reader) (*http.Request, error) {
	rq, err := http.NewRequest(method, semaphoreURL+"/api"+endpoint, body)
	if err != nil {
		return nil, err
	}

	rq.Header.Set("Accept", "application/json")
	rq.Header.Set("Content-Type", "application/json")
	rq.AddCookie(&http.Cookie{
		Name:  "semaphore",
		Value: d.token,
	})

	return rq, nil
}

type createTaskPayload struct {
	Domain     string
	Name       string
	Subdomains string
	ProjectId  string
	TemplateId string
}

const createTaskPayloadTemplate = `{
    "template_id": {{ .TemplateId }},
    "project_id": {{ .ProjectId }},
    "environment": "{\"ANSIBLE_HOST_KEY_CHECKING\": \"False\",\"ANSIBLE_CONFIG\": \"/tmp/semaphore/ansible.cfg\",\"SUBDOMAINS\": {{ .Subdomains }},\"CURRENT_DOMAIN\": \"{{ .Domain }}\",\"LABEL\": \"{{ .Name }}\"\n}"
}`

func (d *deployer) deploy(domain string, subs map[string]string) (err error) {
	return d.createAndRunTask(domain, subs)
}

func Deploy(domain string, subs map[string]string) {
	d := newDeployer()
	err := d.login()
	if err != nil {
		panic(err)
	}
	d.projectId = os.Getenv(ENV_PROJECT_ID)
	d.templateId = os.Getenv(ENV_TEMPLATE_ID)

	if d.projectId == "" || d.templateId == "" {
		panic("PROJECT_ID or TEMPLATE_ID not set")
	}

	if err := d.deploy(domain, subs); err != nil {
		panic(err)
	}

	fmt.Printf("Successfully deployed %s", domain)
}
