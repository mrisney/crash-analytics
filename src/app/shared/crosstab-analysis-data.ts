import {JsonObject, JsonProperty} from "json2typescript";
import { ValueList } from "./crosstab-analaysis-value-list";

@JsonObject("CrossTabAnalysisData")
export class CrossTabAnalysisData {
    
    @JsonProperty("row", String)
    row: string;

    @JsonProperty("valueList", [ValueList])
    valueList: ValueList[];
    
}