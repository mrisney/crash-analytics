import {JsonObject, JsonProperty} from "json2typescript";

@JsonObject("ValueList")
export class ValueList {

    @JsonProperty("key", String)
    key: string;

    @JsonProperty("value", Number)
    value: number;
}