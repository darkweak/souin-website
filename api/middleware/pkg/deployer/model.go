package deployer

import (
	"fmt"
	"strings"
)

func parseValue(key string, value interface{}) string {
	switch (key) {
	case "allowed_http_verbs":
		val := []string{}
		for _, v := range value.([]interface{}) {
			val = append(val, v.(string))
		}
		return fmt.Sprintf("allowed_http_verbs %s", strings.Join(val, " "))
	case "api":
		s := ""
		apiValues := value.(map[string]interface{})
		hasAPIEndpoint := false
		for apiK, apiV := range apiValues {
			switch(apiK) {
			case "basepath":
				s += fmt.Sprintf("\n  basepath %s", apiV.(string))
			case "souin", "prometheus":
				if av, ok := apiV.(map[string]interface{}); ok {
					if a, o := av["enabled"]; o && a != nil && a.(bool) {
						hasAPIEndpoint = true
						s += "\n  "+apiK
					}
				}
			}
		}

		if hasAPIEndpoint {
			return fmt.Sprintf("api {%s\n}", s)
		}
	case "regex":
		s := ""
		regexpValues := value.(map[string]interface{})
		hasRegexp := false
		for regexpK, regexpV := range regexpValues {
			switch(regexpK) {
			case "exclude":
				hasRegexp = true
				s += fmt.Sprintf("\n  exclude %s", regexpV.(string))
			}
		}

		if hasRegexp {
			return fmt.Sprintf("regex {%s\n}", s)
		}
	case "cache_name", "default_cache_control", "mode", "ttl", "stale":
		return fmt.Sprintf("%s %s", key, value.(string))
	case "distributed":
		if v, ok := value.(bool); ok && v {
			return fmt.Sprintf("%s %v", key, value.(bool))
		}
	case "cache_keys":
		s := ""
		cacheKeys := value.(map[string]interface{})
		for ckKey, ckVal := range cacheKeys {
			c := ""
			for keyK, keyV := range ckVal.(map[string]interface{}) {
				switch (keyK) {
				case "disable_body", "disable_host", "disable_method", "disable_query":
					c += "\n      "+keyK
				case "headers":
					headers := []string{}
					for _, v := range keyV.([]interface{}) {
						headers = append(headers, v.(string))
					}
					c += fmt.Sprintf("\n    headers %s", strings.Join(headers, " "))
				}
			}
			
			s += fmt.Sprintf("\n  %s {%s\n  }", ckKey, c)
		}

		return fmt.Sprintf("cache_keys {%s\n}", s)
	}

	return ""
}

func getCaddyfileValues(value map[string]interface{}) string {
	acc := ""

	for k, v := range value {
		s := parseValue(k, v)
		if s != "" {
			acc += "\n      "+s
		}
	}

	return fmt.Sprintf("{%s\n    }", acc)
}