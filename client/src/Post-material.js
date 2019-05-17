import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from "@material-ui/core/Grid"

import axios from 'axios'

class PostMaterial extends Component {
    constructor(){
        super();

        this.state = {
            //controle dos dados
            name: 'Fábio Fusimoto Pires',
            institution: 'Escola Politécnica',
            graduation_date: '2021-01-01',
            license_number: 9853294,
            birth_date: '1998-10-28',
            course_name: 'Engenharia Elétrica',
            address: 'Avenida Alberto Byington, 2306',
        };
    }

    submitNewInstructor = () =>{
        //Post a new instructor 
        const url = 'http://localhost:8888/api/instructors/';

        axios.post(url,
            {
                name: this.state['name'],
                institution: this.state['institution'],
                graduation_date: this.state['graduation_date'],
                license_number: this.state['license_number'],
                birth_date: this.state['birth_date'],
                course_name: this.state['course_name'],
                address: this.state['address']
            }).then(function (response){
                console.log(response.data['endpoint']);
            });        
    }
    
    displayStateOnConsole = () =>{ // for debugging purposes
        console.log("Nome: " + this.state['name']);
        console.log("Número do brevê: " + this.state['license_number'] + "\n\r");
        console.log("Endereço: " + this.state['address'] + "\n\r");
        console.log("Data de nascimento: " + this.state['birth_date'] + "\n\r");
        console.log("Nome do curso: " + this.state['course_name'] + "\n\r");        
        console.log("Data de formação: " + this.state['graduation_date'] + "\n\r");
        console.log("Instituição: " + this.state['institution'] + "\n\r");
    }

    handleChange = name => event => {
        this.setState({[name] : event.target.value})
    }

    render() {
        return (
            <div className='margin'>
                <Button 
                    variant = "contained" 
                    color = "secondary"
                    onClick = {this.displayStateOnConsole}
                >Mostrar estado no console
                </Button>                
                <form>
                    <Grid container spacing={16} lg = {13}>
                        <Grid item xs={3}>
                            <TextField
                                id = "TextField_name" 
                                label = "Nome"
                                className = "TextField" 
                                type = "text"
                                required = {true}
                                variant = "outlined" 
                                margin = "normal"
                                fullWidth = {true}
                                value = {this.state.value} 
                                onChange = {this.handleChange('name')}
                            />
                        </Grid>
                        <Grid item xs={2}>
                                <TextField
                                    id = "TextField_license_number"
                                    label = "Número do brevê"
                                    className = "TextField"
                                    type = "number"
                                    required = {true}
                                    variant = "outlined"
                                    margin = "normal"
                                    fullWidth = {true}
                                    value = {this.state.value}
                                    onChange = {this.handleChange('license_number')}
                                />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                id = "TextField_address"
                                label = "Endereço"
                                className = "TextField"
                                type = "text"
                                required = {true}
                                variant = "outlined"
                                margin = "normal"
                                fullWidth = {true}
                                value = {this.state.value}
                                onChange = {this.handleChange('address')}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                id = "TextField_birth_date"
                                label = "Data de Nascimento"
                                className = "TextField"
                                type = "date"
                                required = {true}
                                variant = "outlined"
                                margin = "normal"
                                InputLabelProps = {{shrink: true}} // para não ocorrer sobreposição da label e do dd/mm/yyyy
                                fullWidth = {true}
                                value = {this.state.value}
                                onChange = {this.handleChange('birth_date')}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={16} lg = {13}>
                        <Grid item xs = {3}>
                            <TextField
                                id = "TextField_course_name"
                                label = "Nome do curso"
                                className = "TextField"
                                type = "text"
                                required = {true}
                                variant = "outlined"
                                margin = "normal"
                                fullWidth = {true}
                                value = {this.state.value}
                                onChange = {this.handleChange('course_name')}
                            />
                        </Grid>
                        <Grid item xs = {2}>
                            <TextField
                                id = "TextField_graduation_date"
                                label = "Data de conclusão de curso"
                                className = "TextField"
                                type = "date"
                                required = {true}
                                variant = "outlined"
                                margin = "normal"
                                InputLabelProps = {{shrink: true}} // para não ocorrer sobreposição da label e do dd/mm/yyyy
                                fullWidth = {true}
                                value = {this.state.value}                        
                                onChange = {this.handleChange('graduation_date')}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                id = "TextField_institution"
                                label = "Instituição cursada"
                                className = "TextField"
                                type = "text"
                                required = {true}
                                variant = "outlined"
                                margin = "normal"
                                fullWidth = {true}
                                value = {this.state.value}
                                onChange = {this.handleChange('institution')}
                            />
                        </Grid>
                    </Grid>
                </form>
                    <Button 
                        variant = "contained" 
                        color = "primary"  
                        onClick = {this.submitNewInstructor}
                    >
                    Inscrever instrutor
                    </Button>
            </div>
        )
    }
}

export default PostMaterial