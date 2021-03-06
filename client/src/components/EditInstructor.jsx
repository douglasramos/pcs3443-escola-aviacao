import React, { Component } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
// ícones
import Search from '@material-ui/icons/Search';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Edit from '@material-ui/icons/Edit';

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
    const url = `https://cors-anywhere.herokuapp.com/http://ec2-18-212-165-41.compute-1.amazonaws.com/api/instructors/${this.state.idField}`;
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
            this.setState({ displayNotFound: true, idGet: false, edit: false });
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
      licenseNumber: '',
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
    const url = `https://cors-anywhere.herokuapp.com/http://ec2-18-212-165-41.compute-1.amazonaws.com/api/instructors/${this.state.idDisplay}`;
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

  disableEdit = () => {
    // ao se cancelar a edição, tenho que voltar os valores editados para os valores obtidos anteriormente (os que estão salvos no BD)
    const previousName = this.state.name;
    const previousInstitution = this.state.institution;
    const previousGraduationDate = this.state.graduationDate;
    const previousLicenseNumber = this.state.licenseNumber;
    const previousBirthDate = this.state.birthDate;
    const previousCourseName = this.state.courseName;
    const previousAddress = this.state.address;

    this.setState({ edit_name: previousName });
    this.setState({ edit_institution: previousInstitution });
    this.setState({ edit_graduationDate: previousGraduationDate });
    this.setState({ edit_licenseNumber: previousLicenseNumber });
    this.setState({ edit_birthDate: previousBirthDate });
    this.setState({ edit_courseName: previousCourseName });
    this.setState({ edit_address: previousAddress });

    this.setState({ edit: false });
  };

  enableEdit = () => {
    this.setState({ edit: true });
  };

  deleteInstructor = () => {
    const url = `https://cors-anywhere.herokuapp.com/http://ec2-18-212-165-41.compute-1.amazonaws.com/api/instructors/${this.state.idDisplay}`;
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

  render() {
    return (
      <Paper style={{ padding: 30 }}>
        <div>
          <Typography component="h4" variant="h4" gutterBottom>
            Busca instrutor
          </Typography>
          <Grid container justify="space-between">
            <Grid item>
              <TextField
                id="TextField_id"
                label="Buscar instrutor por ID"
                type="number"
                name="idField"
                required
                variant="outlined"
                margin="normal"
                value={this.state.idField}
                onChange={this.handleChange}
              />
              <Tooltip title="Buscar instrutor">
                <IconButton
                  color="primary"
                  onClick={this.getByID}
                  style={{ position: 'relative', top: '20px', left: '4px' }}
                >
                  <Search />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              {!this.state.idGet ? (
                ''
              ) : (
                <div>
                  <Tooltip title="Editar instrutor">
                    <IconButton
                      color="primary"
                      onClick={this.enableEdit}
                      style={{ position: 'relative', top: '20px', left: '4px' }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir instrutor">
                    <IconButton
                      color="secondary"
                      onClick={this.deleteInstructor}
                      style={{ position: 'relative', top: '20px', left: '4px' }}
                    >
                      <DeleteForever />
                    </IconButton>
                  </Tooltip>
                </div>
              )}
            </Grid>
          </Grid>
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
          <div className="mt-3 text-right">
            {this.state.idGet && this.state.edit ? (
              <Button variant="outlined" color="primary" onClick={this.disableEdit}>
                Cancelar
              </Button>
            ) : null}{' '}
            {!this.state.edit ? null : (
              <Button
                className="m1-3"
                variant="contained"
                onClick={this.editAPI}
                style={{ backgroundColor: '#2cad58', color: 'white' }}
              >
                Salvar alterações
              </Button>
            )}
          </div>
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
                Dados do instrutor {this.state.edit_name} (ID:{this.state.idDisplay}) atualizados
                com sucesso
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
        </div>
      </Paper>
    );
  }
}

export default EditInstructor;
