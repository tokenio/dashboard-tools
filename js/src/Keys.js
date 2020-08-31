import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import forge from 'node-forge';
import React, { Component } from 'react';
import './App.css';
import { strKey } from './utils';

export default class GenerateKeys extends Component {
    constructor(props) {
        super(props);
        this.state = {
            publicKey: '',
            privateKey: '',
        };
    }

    handleClick = () => {
        const keypair = forge.pki.ed25519.generateKeyPair();

        this.setState({
            publicKey: strKey(keypair.publicKey),
            privateKey: strKey(keypair.privateKey),
        });
    };

    render() {
        return (
            <div className={'GenerateKeys'}>
                <form>
                    <FormControl fullWidth>
                        <h2>Generate Keys</h2>
                        <div>
                            <Button variant="contained" color="primary"
                                    onClick={this.handleClick}>Generate</Button>
                            <Divider className={'divider'} />
                        </div>
                    </FormControl>
                </form>
                {this.state.publicKey && this.state.privateKey && (
                    <Grid container item xs={12} spacing={4} justify={'center'}>
                        <Grid item xs={12} lg={8}>
                            <Input id="publicKey" value={this.state.publicKey} fullWidth />
                            <FormHelperText id="publicKey">Your public key in ED25519
                                format.</FormHelperText>
                        </Grid>
                        <Grid item xs={12} lg={8}>
                            <Input id="privateKey" value={this.state.privateKey}
                                   fullWidth />
                            <FormHelperText id="privateKey">Your private key in ED25519
                                format.</FormHelperText>
                        </Grid>
                    </Grid>
                )}
            </div>
        );
    }
};
