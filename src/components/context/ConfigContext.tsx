import React from 'react';
import { Toast } from 'native-base';
import { IProject, IClaim } from '../../models/project';
import { Ixo } from 'ixo-module';
import { env } from '../../../config';
import { GetSignature, verifyDocumentSignature } from "../../utils/sovrin";
import _ from 'underscore';


const { Provider, Consumer } = React.createContext({});

export class ConfigProvider extends React.Component {
    
    state = {
        projects: null,
        claims: null,
        ixo: new Ixo(env.REACT_APP_BLOCKCHAIN_IP, env.REACT_APP_BLOCK_SYNC_URL),
        getProjects: () => {
            this.state.ixo.project.listProjects()
            .then((response: any) => {
                if (!response) {
                    response = [];
                }
                // debugger;
                const projects: IProject[] = response;

                Toast.show({
                    text: 'Synced',
                    buttonText: 'OK',
                    type: 'success'
                });
                this.setState({ projects });
            }).catch((result: Error) => {
                Toast.show({
                    text: 'Failed to load projects',
                    buttonText: 'OK',
                    type: 'danger'
                });
            });
        },
        getClaims: (projectDid: string, pdsURL: string) => {
            const ProjectDIDPayload: Object = { projectDid: projectDid };
            GetSignature(ProjectDIDPayload).then((signature) => {
                this.state.ixo.claim.listClaimsForProject(ProjectDIDPayload, signature, pdsURL).then((response: any) => {
                    debugger;
                    if (response.error) {
                        this.setState({ claims: [] });
                        Toast.show({
                            text: 'Failed to load claims',
                            buttonText: 'OK',
                            type: 'danger'
                        });
                    } else {
                        this.setState({ claims: response.result });
                    }
                });
            }).catch((error) => {
                this.setState({ claims: [] });
                console.log('error catch', error);
                Toast.show({
                    text: 'Failed to authenticate',
                    buttonText: 'OK',
                    type: 'danger'
                });
            });
        },
        getFormFile: (projectDid: string) => {
            if (this.state.projects) {
                let project: IProject = _.find(this.state.projects, (project: IProject) => {
                    return project.projectDid === projectDid;
                });
                this.state.ixo.project.fetchPublic(project.data.templates.claim.form, project.data.serviceEndpoint).then((res: any) => {
                    return Buffer.from(res.data, 'base64').toString('ascii');
                });
            }
        },
    }

    render() {
        return (
            <Provider 
                value={{
                    ixo: this.state.ixo,
                    projects: this.state.projects,
                    claims: this.state.claims,
                    getProjects: this.state.getProjects,
                    getClaims: this.state.getClaims,
                    getFormFile: this.state.getFormFile,
                }}
            >
                {this.props.children}
            </Provider>
        );
    }
}

export default Consumer;