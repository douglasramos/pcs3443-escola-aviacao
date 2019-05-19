import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from "@material-ui/core/Grid"

import axios from 'axios'

class EditInstructor extends Component{
    constructor(){
        super()
         this.state = {
            id: null,
            name: '',
            institution: '',
            graduation_date: '',
            license_number: null,
            birth_date: '',
            course_name: '',
            address: '',
            edit_name: '',//edit_ salvam valores a serem colocados no banco de dados sem compremeter os valores sendo consultados no momento
            edit_inst: '',
            edit_grad: '',
            edit_license: '',
            edit_birth: '',
            edit_course: '',
            edit_address: '',
            edit: false,
            idGet: false
         }
        this.getID = this.getID.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.buttonClick = this.buttonClick.bind(this)
        this.display = this.display.bind(this)
        this.editAPI = this.editAPI.bind(this)
        this.deleteInstructor = this.deleteInstructor.bind(this)
    }
    componentDidMount(){
        console.log(this.state)
    }

    getID(){
        const url = 'http://localhost:8888/api/instructors/'+this.state.id
    
        axios.get(url)
        .then(response => this.setState({

            name: response.data.name,
            edit_name: response.data.name,
            institution: response.data.institution,
            edit_inst: response.data.institution,
            graduation_date: response.data.graduation_date,
            edit_grad: response.data.graduation_date,
            license_number: response.data.license_number,
            edit_license: response.data.license_number,
            birth_date: response.data.birth_date,
            edit_birth: response.data.birth_date,
            course_name: response.data.course_name,
            edit_course: response.data.course_name,
            address: response.data.address,
            edit_address: response.data.address

        }))
        this.state.idGet = true
    }

    handleChange = name => event => {
        this.setState({[name] : event.target.value})
    }

    buttonClick(){
        const currentstate = this.state.edit
        this.setState({ ['edit']: !currentstate })

    }

    editAPI () {
        const url = 'http://localhost:8888/api/instructors/'+this.state.id
        axios.put(url,
            {
                name: this.state.edit_name,
                name: this.state.edit_name,
                institution: this.state.edit_inst,
                graduation_date: this.state.edit_grad,
                license_number: this.state.edit_license,
                birth_date: this.state.edit_birth,
                course_name: this.state.edit_course,
                address: this.state.edit_address
            }).then(function (response){
                console.log(response.data['endpoint'])
            })
    }

    deleteInstructor() { 
        const url = 'http://localhost:8888/api/instructors/'+this.state.id
        axios.delete (url)
        
        this.setState({
            id: null,
            name: '',
            institution: '',
            graduation_date: '',
            license_number: null,
            birth_date: '',
            course_name: '',
            address: '',
            edit_name: '',
            edit_inst: '',
            edit_grad: '',
            edit_license: '',
            edit_birth: '',
            edit_course: '',
            edit_address: '',
            edit: false,
            idGet: false
       })
    }

    display(){//debugging
        console.log(this.state)
    }

    render(){
        return(
            <div className='margin' >
                 <TextField
                    id = "TextField_id" 
                    label = "Buscar ID"
                    className = "TextField" 
                    type = "text"
                    required = {true}
                    variant = "outlined" 
                    margin = "normal"
                    fullWidth = {true}
                    value = {this.state.id} 
                    onChange = {this.handleChange('id')}
                /> 
                
                <Button 
                    variant = "contained" 
                    onClick = {this.getID}
                >Buscar
                </Button> 

                <Button //debugging
                    variant = "contained" 
                    onClick = {this.display}
                >LOG 
                </Button>               
                <form>
                    <h5>Número de matrícula: </h5>
                    <div>{this.state.idGet ? this.state.id : null}</div>
                    <h5>Nome:</h5>
                    <div> {!this.state.edit ? this.state.name : 
                        <TextField
                        id = "TextField_name" 
                        className = "TextField"
                        placeholder = {this.state.name} 
                        type = "text"
                        variant = "outlined" 
                        required = {true}
                        margin = "normal"
                        value = {this.state.edit_name} 
                        onChange = {this.handleChange('edit_name')}
                    /> } </div>

                    <h5>Data de Nascimento: </h5>

                    <div>{!this.state.edit ? this.state.birth_date : 
                        <TextField
                        id = "TextField_birth" 
                        className = "TextField"
                        placeholder = {this.state.birth_date} 
                        type = "date"
                        variant = "outlined"  
                        required = {true}
                        margin = "normal"
                        value = {this.state.edit_birth} 
                        onChange = {this.handleChange('edit_birth')}
                    /> } </div>

                    <h5>Endereço:  </h5>

                    <div>{!this.state.edit ? this.state.address : 
                        <TextField
                        id = "TextField_address" 
                        className = "TextField"
                        placeholder = {this.state.address} 
                        type = "text"
                        variant = "outlined"  
                        required = {true}
                        margin = "normal"
                        value = {this.state.edit_address} 
                        onChange = {this.handleChange('edit_address')}
                    /> } </div>

                    <h5>Número do brevê:  </h5>

                    <div>{!this.state.edit ? this.state.license_number : 
                        <TextField
                        id = "TextField_license" 
                        className = "TextField"
                        placeholder = {this.state.license_number} 
                        type = "number"
                        variant = "outlined"  
                        required = {true}
                        margin = "normal"
                        value = {this.state.edit_license} 
                        onChange = {this.handleChange('edit_license')}
                    /> } </div>

                    <h5>Curso:  </h5>

                    <div>{!this.state.edit ? this.state.course_name : 
                        <TextField
                        id = "TextField_course" 
                        className = "TextField"
                        placeholder = {this.state.course_name} 
                        type = "text"
                        variant = "outlined"  
                        required = {true}
                        margin = "normal"
                        value = {this.state.edit_couse} 
                        onChange = {this.handleChange('edit_course')}
                    /> } </div>

                    <h5>Escola:  </h5>

                    <div>{!this.state.edit ? this.state.institution : 
                        <TextField
                        id = "TextField_institution" 
                        className = "TextField"
                        placeholder = {this.state.institution} 
                        type = "text"
                        variant = "outlined" 
                        required = {true} 
                        margin = "normal"
                        value = {this.state.edit_inst} 
                        onChange = {this.handleChange('edit_inst')}
                    /> } </div>

                    <h5>Data de formação:  </h5>

                    <div>{!this.state.edit ? this.state.graduation_date : 
                        <TextField
                        id = "TextField_graduation" 
                        className = "TextField"
                        placeholder = {this.state.graduation_date} 
                        type = "date"
                        variant = "outlined" 
                        required = {true} 
                        margin = "normal"
                        value = {this.state.edit_grad} 
                        onChange = {this.handleChange('edit_grad')}
                    /> } </div>
                    
                    <Grid container spacing={16} >
                        <Grid item xs={3}>
                            {!this.state.idGet ? null :    
                                <Button 
                                    variant = "contained" 
                                    color = "primary"
                                    onClick = {this.buttonClick}
                                > {this.state.edit ? "Cancelar" : "Editar"}
                                </Button>}
                        </Grid>
                        <Grid item xs={2}>
                            {!this.state.idGet ? null : 
                                <Button 
                                    variant = "contained" 
                                    color = "secondary"
                                    onClick = {this.deleteInstructor}
                                >Deletar
                                </Button>}
                        </Grid>
                    </Grid>
                    {!this.state.edit ? null : 
                        <Button
                            variant = "contained"
                            onClick = {this.editAPI}          
                        > Finalizar
                        </Button>
                    }
                    
                </form>

            </div>
        )
    }

}

export default EditInstructor