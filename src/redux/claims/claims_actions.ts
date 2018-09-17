import { IClaim } from '../../models/project';

export interface Claim {
    claimData: string;
    projectDid: string;
    claimId: string;
}

export interface ClaimForm {
    formFile: any;
    projectDid: string;
}

export module CLAIM_ADD {
    export var type = 'CLAIM_ADD';
}

export module CLAIM_UPDATE {
    export var type = 'CLAIM_UPDATE';
}

export module CLAIM_FILEFORM_SAVE {
    export var type = 'CLAIM_FILEFORM_SAVE';
}

export module CLAIM_SUBMIT_ALL {
    export var type
}
