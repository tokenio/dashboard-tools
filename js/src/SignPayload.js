import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import stringify from 'fast-json-stable-stringify';
import forge from 'node-forge';
import React, { Component } from 'react';
import './App.css';
import { bufferKey } from './utils';

export default class SignPayload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isValid: false,
            form: {
                payload: '',
                privateKey: '',
            },
            signature: '',
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

    handleClick = async () => {
        const forgeSignature = forge.pki.ed25519.sign({
            message: stringify(JSON.parse(this.state.form.payload)),
            encoding: 'binary',
            privateKey: bufferKey(this.state.form.privateKey),
        });

        const base64 = forge.util.encode64(forge.util.binary.raw.encode(forgeSignature));
        const normalizedPayload = base64
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/g, '')
            .replace(/\s/g, '');

        this.setState({
            signature: normalizedPayload,
        });
    };

    render() {
        return (
            <div className={'SignPayload'}>
                <form>
                    <FormControl fullWidth>
                        <h2>Sign Payload</h2>

                        <Grid item container xs={12}>
                            <Grid item xs={2} />
                            <Grid item container xs={8} spacing={4} justify={'center'}>
                                <Grid item xs={6}>
                                    <TextField label="Private Key Privileged"
                                               value={this.state.form.privateKey}
                                               name="privateKey"
                                               onChange={this.handleChange}
                                               fullWidth />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField label="Payload" value={this.state.form.payload}
                                               name="payload"
                                               multiline
                                               rows={10}
                                               onChange={this.handleChange}
                                               fullWidth />
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
                {this.state.signature && (
                    <Grid container item xs={12} spacing={4} justify={'center'}>
                        <Grid item xs={12} lg={8}>
                            <Input id="signature" value={this.state.signature} fullWidth />
                            <FormHelperText id="signature">Your signature.</FormHelperText>
                        </Grid>
                    </Grid>
                )}
            </div>
        );
    }
};
