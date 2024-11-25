export interface Resource {
    name:                      string;
    description:               string;
    repositorySourceOwner:     string;
    type:                      string;
    technologies:              string[];
    category:                  string[];
    subCategory:               string[];
    estimatedCost:             string;
    previousVersions:          any[];
    cloudProvider:             string;
    links:                     Link[];
    relatedParty:              RelatedParty[];
    specifications:            Specification[];
    id:                        string;
    commonVersionId:           string;
    version:                   string;
    status:                    string;
    creationTime:              Date;
    enable:                    boolean;
    repositorySourceBranchRef: string;
    repositorySourceKind:      string;
    repositorySourceName:      string;
    repositorySourceUrl:       string;
}

export interface Link {
    type:  string;
    label: string;
    value: string;
}

export interface RelatedParty {
    name:     string;
    email:    string;
    username: string;
    id:       string;
    role:     string;
}

export interface Specification {
    inputs:    Input[];
    providers: any[];
}

export interface Input {
    key:          string;
    defaultValue: string;
    type:         string;
    required:     boolean;
}






