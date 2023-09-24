package deployer

import (
	"encoding/json"
	"fmt"
	"testing"
)

const sample1 = "{\"mode\":\"bypass_request\",\"allowed_http_verbs\":[\"GET\",\"PATCH\"]}"
const sample2 = "{\"mode\":\"bypass\",\"allowed_http_cache\":[\"GET\",\"PATCH\"],\"api\":{\"basepath\":\"/something\",\"souin\":{\"enabled\":false},\"prometheus\":{\"enabled\":true}},\"cache_name\":\"bonjour\",\"default_cache_control\":\"public, max-age=3600\",\"distributed\":true}"
const sample3 = "{\"mode\":\"bypass\",\"allowed_http_cache\":[\"GET\",\"PATCH\"],\"api\":{\"basepath\":\"/something\",\"souin\":{\"enabled\":false}},\"cache_name\":\"bonjour\",\"default_cache_control\":\"public, max-age=3600\",\"distributed\":true,\"cache_keys\":{\".*\\\\.css\":{\"key\":\".*\\\\.css\",\"disable_body\":true,\"disable_host\":true}}}"

func Test_parseValue(t *testing.T) {
	var parsed map[string]interface{}
	_ = json.Unmarshal([]byte(sample1), &parsed)

	fmt.Println(getCaddyfileValues(parsed))
}
func Test_parseValue2(t *testing.T) {
	var parsed map[string]interface{}
	_ = json.Unmarshal([]byte(sample2), &parsed)

	fmt.Println(getCaddyfileValues(parsed))
}
func Test_parseValue3(t *testing.T) {
	var parsed map[string]interface{}
	_ = json.Unmarshal([]byte(sample3), &parsed)

	fmt.Println(getCaddyfileValues(parsed))
}