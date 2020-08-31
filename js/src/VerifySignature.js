import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { TokenClient } from '@token-io/tpp';
import stringify from 'fast-json-stable-stringify';
import forge from 'node-forge';
import React, { Component } from 'react';
import './App.css';
import { bufferKey } from './utils';

const { SANDBOX, PRODUCTION } = require('./env');

export default class VerifySignature extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isValid: false,
            form: {
                env: SANDBOX,
                payload: '',
                signature: '',
            },
            isSignatureValid: null,
        };
    }

    isValid = () => {
        return Object.values(this.state.form).reduce((prev, curr) => prev && !!curr, true);
    };

    handleChange = (event) => {
        this.setState({
            form: {
                ...this.state.form,
                [event.target.name]: event.target.value,
            },
        }, () => this.setState({ isValid: this.isValid() }));
    };

    async getTokenPublicKey() {
        const Token = new TokenClient({ env: this.state.form.env });

        const tokenMember = await Token._unauthenticatedClient.getTokenMember();
        const { publicKey } = tokenMember.keys[0];

        return publicKey;
    }

    handleClick = async () => {
        const tokenPublicKey = await this.getTokenPublicKey();
        const forgeKeys = {
            publicKey: bufferKey(tokenPublicKey),
        };

        const forgeVerify = forge.pki.ed25519.verify({
            message: stringify(JSON.parse(this.state.form.payload)),
            encoding: 'binary',
            publicKey: forgeKeys.publicKey,
            signature: bufferKey(this.state.form.signature),
        });

        debugger;
        this.setState({
            isSignatureValid: forgeVerify,
        });
    };

    render() {
        return (
            <div className={'Verify Signature'}>
                <form>
                    <FormControl fullWidth>
                        <h2>Verify Signature</h2>

                        <Grid item container xs={12}>
                            <Grid item xs={2} />
                            <Grid item container xs={8} spacing={4} justify={'center'}>
                                <Grid item xs={12}>
                                    <TextField label="Payload" value={this.state.form.payload}
                                               name="payload"
                                               multiline
                                               rows={10}
                                               onChange={this.handleChange}
                                               fullWidth />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField label="Signature" value={this.state.form.signature}
                                               name="signature"
                                               multiline
                                               rows={10}
                                               onChange={this.handleChange}
                                               fullWidth />
                                </Grid>

                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="env-select-label">Environment</InputLabel>
                                        <Select
                                            labelId="env-select-label"
                                            id="env-select"
                                            name="env"
                                            value={this.state.form.env}
                                            onChange={this.handleChange}>
                                            <MenuItem value={SANDBOX}>Sandbox</MenuItem>
                                            <MenuItem value={PRODUCTION}>Production</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary"
                                            onClick={this.handleClick}
                                            disabled={!this.state.isValid}>Create</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </FormControl>
                </form>
                <Divider className={'divider'} />
                {this.state.isSignatureValid !== null && (
                    <Grid container item xs={12} spacing={4} justify={'center'}>
                        <Grid item xs={12} lg={8}>
                            <Input id="isValid" value={this.state.isSignatureValid} fullWidth />
                            <FormHelperText id="isValid">Is signature valid?</FormHelperText>
                        </Grid>
                    </Grid>
                )}
            </div>
        );
    }
};
