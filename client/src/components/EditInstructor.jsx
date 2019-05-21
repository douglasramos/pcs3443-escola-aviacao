import React, { Component } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class EditInstructor extends Component {
  constructor() {
    super();
    this.state = {
      idField: '', // idField é onde se digita
      idFieldIsFilled: '',
      idDisplay: '', // idDisplay é o mostrador do número da matrícula. Separar os dois facilita a lógica
      name: '',
      institution: '',
      graduationDate: '',
      licenseNumber: '',
      birthDate: '',
      courseName: '',
      address: '',
      edit_name: '', // edit_ salvam valores a serem colocados no banco de dados sem compremeter os valores sendo consultados no momento
      edit_nameIsFilled: false,
      edit_institution: '',
      edit_institutionIsFilled: false,
      edit_graduationDate: '',
      edit_graduationDateIsFilled: false,
      edit_licenseNumber: '',
      edit_licenseNumberIsFilled: false,
      edit_birthDate: '',
      edit_birthDateIsFilled: false,
      edit_courseName: '',
      edit_courseNameIsFilled: false,
      edit_address: '',
      edit_addressIsFilled: false,
      edit: false,
      idGet: false,
      displayDeleteSuccess: false,
      displayNotFound: false,
      displayUpdateSuccess: false,
    };
  }

  getByID = () => {
    const url = `http://localhost:8888/api/instructors/${this.state.idField}`;
    const idToDisplay = this.state.idField; // isso evita de que o número da matrícula fique mudando
    if (this.state.idFieldIsFilled) {
      axios
        .get(url)
        .then(response =>
          this.setState(
            {
              idDisplay: idToDisplay,
              name: response.data.name,
              edit_name: response.data.name,
              institution: response.data.institution,
              edit_institution: response.data.institution,
              graduationDate: response.data.graduation_date,
              edit_graduationDate: response.data.graduation_date,
              licenseNumber: response.data.license_number,
              edit_licenseNumber: response.data.license_number,
              birthDate: response.data.birth_date,
              edit_birthDate: response.data.birth_date,
              courseName: response.data.course_name,
              edit_courseName: response.data.course_name,
              address: response.data.address,
              edit_address: response.data.address,
            },
            () => this.setState({ idGet: true })
          )
        )
        .catch(error => {
          if (error.response.status === 404) {
            this.setState({ displayNotFound: true });
          }
        });
      this.setState({ edit_nameIsFilled: true });
      this.setState({ edit_institutionIsFilled: true });
      this.setState({ edit_graduationDateIsFilled: true });
      this.setState({ edit_licenseNumberIsFilled: true });
      this.setState({ edit_birthDateIsFilled: true });
      this.setState({ edit_courseNameIsFilled: true });
      this.setState({ edit_addressIsFilled: true });
    }
  };

  handleChange = event => {
    // é preciso salvar as informações de event em constantes pois na chamada de checkField o event não é preservado
    // eslint-disable-next-line no-console
    console.log(`Campo: ${event.target.name} mudou`);
    const eventName = String(event.target.name);
    const eventValue = event.target.value;
    this.setState({ [event.target.name]: event.target.value }, () =>
      this.checkField(eventName, eventValue)
    );
  };

  checkField = (fieldName, value) => {
    const fieldNameIsFilled = `${String(fieldName)}IsFilled`;
    if (value !== '') {
      this.setState({ [fieldNameIsFilled]: true });
    } else {
      this.setState({ [fieldNameIsFilled]: false });
    }
  };

  resetState = afterDelete => {
    this.setState({
      name: '',
      idDisplay: '',
      institution: '',
      graduationDate: '',
      licenseNumber: null,
      birthDate: '',
      courseName: '',
      address: '',
      edit_name: '',
      edit_institution: '',
      edit_graduationDate: '',
      edit_licenseNumber: '',
      edit_birthDate: '',
      edit_courseName: '',
      edit_address: '',
      edit: false,
      idGet: false,
      displayNotFound: false,
      displayUpdateSuccess: false,
    });
    if (afterDelete) {
      this.setState({ displayDeleteSuccess: true });
    } else {
      this.setState({ displayDeleteSuccess: false });
    }
  };

  editAPI = () => {
    const url = `http://localhost:8888/api/instructors/${this.state.idDisplay}`;

    if (
      this.state.edit_nameIsFilled &&
      this.state.edit_institutionIsFilled &&
      this.state.edit_graduationDateIsFilled &&
      this.state.edit_licenseNumberIsFilled &&
      this.state.edit_birthDateIsFilled &&
      this.state.edit_courseNameIsFilled &&
      this.state.edit_addressIsFilled
    )
      axios
        .put(url, {
          name: this.state.edit_name,
          institution: this.state.edit_institution,
          graduation_date: this.state.edit_graduationDate,
          license_number: this.state.edit_licenseNumber,
          birth_date: this.state.edit_birthDate,
          course_name: this.state.edit_courseName,
          address: this.state.edit_address,
        })
        .then(response => {
          // eslint-disable-next-line no-console
          console.log(response.data.endpoint);
          this.setState({ displayUpdateSuccess: true });
        });
  };

  toggleEdit = () => {
    const previousEditState = this.state.edit;
    const previousName = this.state.name;
    const previousInstitution = this.state.institution;
    const previousGraduationDate = this.state.graduationDate;
    const previousLicenseNumber = this.state.licenseNumber;
    const previousBirthDate = this.state.birthDate;
    const previousCourseName = this.state.courseName;
    const previousAddress = this.state.address;
    // se for uma operação de cancelar, tenho que voltar os valores editado para os valores obtidos anteriormente pelo axios.get()
    if (previousEditState) {
      // a operação foi de cancelamento, logo deve haver reversão de valores
      this.setState({ edit_name: previousName });
      this.setState({ edit_institution: previousInstitution });
      this.setState({ edit_graduationDate: previousGraduationDate });
      this.setState({ edit_licenseNumber: previousLicenseNumber });
      this.setState({ edit_birthDate: previousBirthDate });
      this.setState({ edit_courseName: previousCourseName });
      this.setState({ edit_address: previousAddress });
    }
    this.setState({ edit: !previousEditState });
  };

  deleteInstructor = () => {
    const url = `http://localhost:8888/api/instructors/${this.state.idDisplay}`;
    axios.delete(url).then(this.resetState(true));
  };

  closeUpdateSuccessDialog = () => {
    this.setState({ displayUpdateSuccess: false }, () => this.resetState(false));
  };

  closeDeleteSuccessDialog = () => {
    this.setState({ displayDeleteSuccess: false });
  };

  closeNotFoundDialog = () => {
    this.setState({ displayNotFound: false });
  };

  display = () => {
    // eslint-disable-next-line no-console
    console.log(this.state);
  };

  render() {
    return (
      <div className="margin">
        <Grid container spacing={16}>
          <Grid item xs={8}>
            <TextField
              id="TextField_id"
              label="Buscar instrutor por ID"
              className="TextField"
              type="number"
              name="idField"
              required
              variant="outlined"
              margin="normal"
              value={this.state.idField}
              onChange={this.handleChange}
            />
          </Grid>
        </Grid>
        <Button
          variant="outlined"
          onClick={this.getByID}
          style={{ backgroundColor: '#2cad58', color: 'white' }}
        >
          Buscar
        </Button>
        <Dialog
          open={this.state.displayDeleteSuccess}
          onClose={this.closeDeleteSuccessDialog}
          aria-labelledby="deleteSuccessDialogTitle"
          aria-describedby="deleteSuccessDialogDescription"
        >
          <DialogTitle id="deleteSuccessDialogTitle">Operação completada</DialogTitle>
          <DialogContent>
            <DialogContentText id="deleteSuccessDialogDescription">
              Instrutor deletado com sucesso
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.displayUpdateSuccess}
          onClose={this.closeUpdateSuccessDialog}
          aria-labelledby="updateSuccessDialogTitle"
          aria-describedby="udpateSuccessDialogDescription"
        >
          <DialogTitle id="updateSuccessDialogTitle">Operação completada</DialogTitle>
          <DialogContent>
            <DialogContentText id="deleteSuccessDialogDescription">
              Dados do instrutor {this.state.edit_name} (ID:{this.state.idDisplay}) atualizados com
              sucesso
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.displayNotFound}
          onClose={this.closeNotFoundDialog}
          aria-labelledby="notFoundDialogTitle"
          aria-describedby="notFoundDialogDescription"
        >
          <DialogTitle id="notFoundDialogTitle">Operação não completada</DialogTitle>
          <DialogContent>
            <DialogContentText id="notFoundDialogDescription">
              O instrutor com o ID {this.state.idField} não está cadastrado
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Grid container spacing={16}>
          <Grid item xs={12} sm={6} lg={4}>
            {!this.state.idGet ? null : (
              <TextField
                id="TextField_name"
                label="Nome"
                placeholder={this.state.name}
                type="text"
                name="edit_name"
                variant="outlined"
                required
                fullWidth
                margin="normal"
                disabled={!this.state.edit}
                value={this.state.edit_name}
                onChange={this.handleChange}
                error={!this.state.edit_nameIsFilled && this.state.edit}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6} lg={5}>
            {!this.state.idGet ? null : (
              <TextField
                id="TextField_address"
                label="Endereço"
                placeholder={this.state.address}
                type="text"
                name="edit_address"
                variant="outlined"
                required
                fullWidth
                margin="normal"
                disabled={!this.state.edit}
                value={this.state.edit_address}
                onChange={this.handleChange}
                error={!this.state.edit_addressIsFilled && this.state.edit}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            {!this.state.idGet ? null : (
              <TextField
                id="TextField_birth"
                label="Data de nascimento"
                InputLabelProps={{ shrink: true }} // para não ocorrer sobreposição da label e do dd/mm/yyyy
                type="date"
                variant="outlined"
                name="edit_birthDate"
                required
                fullWidth
                margin="normal"
                disabled={!this.state.edit}
                value={this.state.edit_birthDate}
                onChange={this.handleChange}
                error={!this.state.edit_birthDateIsFilled && this.state.edit}
              />
            )}
          </Grid>
        </Grid>

        <Grid container spacing={16}>
          <Grid item xs={12} sm={6} lg={3}>
            {!this.state.idGet ? null : (
              <TextField
                id="TextField_license"
                label="Número do brevê"
                type="number"
                name="edit_licenseNumber"
                variant="outlined"
                required
                fullWidth
                margin="normal"
                disabled={!this.state.edit}
                value={this.state.edit_licenseNumber}
                onChange={this.handleChange}
                error={!this.state.edit_licenseNumberIsFilled && this.state.edit}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            {!this.state.idGet ? null : (
              <TextField
                id="TextField_course"
                label="Nome do curso"
                placeholder={this.state.courseName}
                type="text"
                variant="outlined"
                name="edit_courseName"
                required
                fullWidth
                margin="normal"
                disabled={!this.state.edit}
                value={this.state.edit_courseName}
                onChange={this.handleChange}
                error={!this.state.edit_courseNameIsFilled && this.state.edit}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            {!this.state.idGet ? null : (
              <TextField
                id="TextField_institution"
                label="Instituição"
                placeholder={this.state.institution}
                type="text"
                variant="outlined"
                name="edit_institution"
                fullWidth
                required
                margin="normal"
                disabled={!this.state.edit}
                value={this.state.edit_institution}
                onChange={this.handleChange}
                error={!this.state.edit_institutionIsFilled && this.state.edit}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            {!this.state.idGet ? null : (
              <TextField
                id="TextField_graduation"
                label="Data de conclusão de curso"
                className="TextField"
                type="date"
                name="edit_graduationDate"
                variant="outlined"
                required
                fullWidth
                InputLabelProps={{ shrink: true }} // para não ocorrer sobreposição da label e do dd/mm/yyyy
                margin="normal"
                disabled={!this.state.edit}
                value={this.state.edit_graduationDate}
                onChange={this.handleChange}
                error={!this.state.edit_graduationDateIsFilled && this.state.edit}
              />
            )}
          </Grid>
        </Grid>
        <Grid container justify="flex-end" spacing={16}>
          <Grid item xs={4} sm={2} lg={1}>
            {!this.state.idGet ? null : (
              <Button variant="contained" color="primary" onClick={this.toggleEdit}>
                {this.state.edit ? 'Cancelar' : 'Editar'}
              </Button>
            )}
          </Grid>
          <Grid item xs={4} sm={2} lg={1}>
            {!this.state.idGet ? null : (
              <Button variant="contained" color="secondary" onClick={this.deleteInstructor}>
                Deletar
              </Button>
            )}
          </Grid>
          <Grid item xs={4} sm={2} lg={1}>
            {!this.state.edit ? null : (
              <Button
                variant="contained"
                onClick={this.editAPI}
                style={{ backgroundColor: '#2cad58', color: 'white' }}
              >
                Finalizar
              </Button>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default EditInstructor;
