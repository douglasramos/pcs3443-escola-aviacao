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

class EditStudent extends Component {
  constructor() {
    super();
    this.state = {
      idField: '',
      idFieldIsFilled: '',
      idDisplay: '',
      name: '',
      birthDate: '',
      address: '',
      flightTime: '',
      courseDuration: '',
      edit_name: '', // edit_ salvam valores a serem colocados no banco de dados sem compremeter os valores sendo consultados no momento
      edit_nameIsFilled: false,
      edit_birthDate: '',
      edit_birthDateIsFilled: false,
      edit_address: '',
      edit_addressIsFilled: false,
      edit: false,
      idGet: false,
      displayDeleteSuccess: false,
      displayNotFound: false,
      displayUpdateSuccess: false,
      licenseAvailable: false,
    };
  }

  getByID = () => {
    const url = `http://localhost:8888/api/students/${this.state.idField}`;
    const idToDisplay = this.state.idField; // isso evita de que o número da matrícula fique mudando

    if (this.state.idFieldIsFilled) {
      axios
        .get(url)
        .then(response => {
          console.log(response.data);
          this.setState(
            {
              idDisplay: idToDisplay, // salva o ID que se quer modificar para que dependa do input atual
              name: response.data.name,
              edit_name: response.data.name,
              birthDate: response.data.birth_date,
              edit_birthDate: response.data.birth_date,
              address: response.data.address,
              edit_address: response.data.address,
              courseDuration: response.data.courseDuration,
              flightTime: response.data.flightTime,
              licenseAvailable: response.data.licenseAvailable,
            },
            () => this.setState({ idGet: true })
          );
        })
        .catch(error => {
          if (error.response.status === 404) {
            this.setState({ displayNotFound: true, idGet: false, edit: false });
          }
        });
      this.setState({ edit_nameIsFilled: true });
      this.setState({ edit_birthDateIsFilled: true });
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
      birthDate: '',
      address: '',
      edit_name: '',
      edit_birthDate: '',
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
    const url = `http://localhost:8888/api/students/${this.state.idDisplay}`;
    if (
      this.state.edit_nameIsFilled &&
      this.state.edit_birthDateIsFilled &&
      this.state.edit_addressIsFilled
    )
      axios
        .put(url, {
          name: this.state.edit_name,
          birth_date: this.state.edit_birthDate,
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
    const previousBirthDate = this.state.birthDate;
    const previousAddress = this.state.address;

    this.setState({ edit_name: previousName });
    this.setState({ edit_birthDate: previousBirthDate });
    this.setState({ edit_address: previousAddress });
    this.setState({ edit: false });
  };

  enableEdit = () => {
    this.setState({ edit: true });
  };

  deleteStudent = () => {
    const url = `http://localhost:8888/api/students/${this.state.idDisplay}`;
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

  generateLicense = () => {
    // emissão do brevê
    console.log('Brevê emitido');
  };

  render() {
    let progress;

    if (this.state.idGet) {
      if (!this.state.licenseAvailable) {
        progress = (
          <Grid container spacing={16}>
            <Grid item>
              Tempo de voo acumulado: {Math.floor(this.state.flightTime / 3600)}h
              {`00${(this.state.flightTime % 3600) / 60}`.slice(-2)}min Duração do curso:{' '}
              {this.state.courseDuration}h00min
            </Grid>
          </Grid>
        );
      } else {
        progress = (
          <Grid container justify="space-between">
            <Grid item style={{ position: 'relative', top: '10px' }}>
              Tempo de voo acumulado: {Math.floor(this.state.flightTime / 3600)}h
              {`00${(this.state.flightTime % 3600) / 60}`.slice(-2)}min Duração do curso:{' '}
              {this.state.courseDuration}h00min
            </Grid>
            <Grid item style={{ position: 'relative', top: '-10px' }}>
              <Button
                className="m1-3"
                variant="contained"
                onClick={this.generateLicense}
                style={{
                  backgroundColor: '#F50057',
                  color: 'white',
                  position: 'relative',
                  top: '15px',
                }}
              >
                Emitir brevê
              </Button>
            </Grid>
          </Grid>
        );
      }
    } else {
      progress = '';
    }

    return (
      <Paper style={{ padding: 30 }}>
        <div>
          <Typography component="h4" variant="h4" gutterBottom>
            Busca de aluno
          </Typography>
          <Grid container justify="space-between">
            <Grid item>
              <TextField
                id="TextField_id"
                label="Buscar aluno por ID"
                type="number"
                name="idField"
                required
                variant="outlined"
                margin="normal"
                value={this.state.idField}
                onChange={this.handleChange}
              />
              <Tooltip title="Buscar aluno">
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
                <div style={{ 'text-align': 'end' }}>
                  <Tooltip title="Deletar aluno">
                    <IconButton
                      color="secondary"
                      onClick={this.deleteStudent}
                      style={{ top: '20px' }}
                    >
                      <DeleteForever />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar aluno">
                    <IconButton color="secondary" onClick={this.enableEdit} style={{ top: '20px' }}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                </div>
              )}
            </Grid>
          </Grid>
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
          {!this.state.idGet ? null : (
            <TextField
              id="TextField_address"
              placeholder={this.state.address}
              type="text"
              label="Endereço"
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
          {!this.state.idGet ? null : (
            <TextField
              id="TextField_birth"
              placeholder={this.state.birthDate}
              type="date"
              label="Data de nascimento"
              name="edit_birthDate"
              variant="outlined"
              required
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }} // para não ocorrer sobreposição da label e do dd/mm/yyyy
              disabled={!this.state.edit}
              value={this.state.edit_birthDate}
              onChange={this.handleChange}
              error={!this.state.edit_birthDateIsFilled && this.state.edit}
            />
          )}
          {progress}
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
                Aluno deletado com sucesso
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
                Dados do aluno {this.state.edit_name} (ID:{this.state.idDisplay}) atualizados com
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
                O aluno com o ID {this.state.idField} não está cadastrado
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </div>
      </Paper>
    );
  }
}

export default EditStudent;
