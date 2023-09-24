package api

type Configuration struct {
	Zone          string `json:"zone"`
	IP            string `json:"ip"`
	Configuration string `json:"configuration"`
	Domain        string `json:"domain,omitempty"`
}

type Domain struct {
	Id             string `json:"@id"`
	Dns            string `json:"dns"`
	Configurations []Configuration `json:"configurations"`
}