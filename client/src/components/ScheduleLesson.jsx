import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import axios from 'axios';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

class ScheduleLesson extends Component {
  constructor() {
    super();
    this.state = {
      idField: '',
      idFieldIsFilled: false,
      date: new Date().toISOString().split('T')[0],
      dateIsFilled: true,
      startTime: '',
      startTimeIsFilled: false,
      endTime: '',
      endTimeIsFilled: false,
      instructorList: [],
      selectedInstructor: '',
      selectedInstructorIsFilled: false,
      instructorsAreListed: false,
      displaySuccess: false,
      displayStudentNotFound: false,
      displayStudentConflict: false,
      displayInstructorConflict: false,
      wasSubmitted: false,
    };
  }

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
      this.setState({ [fieldNameIsFilled]: true }, () => this.getAvailableInstructors());
    } else {
      this.setState({ [fieldNameIsFilled]: false }, () => this.getAvailableInstructors());
    }
  };

  getAvailableInstructors = () => {
    if (
      this.state.idFieldIsFilled &&
      this.state.dateIsFilled &&
      this.state.startTimeIsFilled &&
      this.state.endTimeIsFilled
    ) {
      axios({
        method: 'get',
        url: 'http://localhost:8888/api/lessons/availableinstructors',
        headers: { 'Content-Type': 'application/json' },
        params: {
          day: String(this.state.date),
          start: String(`${this.state.startTime}:00`),
          finish: String(`${this.state.endTime}:00`),
        },
      }).then(response =>
        this.setState(
          { instructorList: response.data },
          this.setState({ instructorsAreListed: true }, () => console.log(response.data))
        )
      );
    } else {
      this.setState({ selectedInstructorIsFilled: false }, () =>
        this.setState({ instructorList: [] })
      );
    }
  };

  closeStudentNotFound = () => {
    this.setState({ displayStudentNotFound: false });
  };

  closeStudentConflict = () => {
    this.setState({ displayStudentConflict: false });
  };

  closeInstructorConflict = () => {
    this.setState({ displayInstructorConflict: false });
  };

  closeSuccess = () => {
    this.setState({ displaySuccess: false }, () => this.resetState());
  };

  resetState = () => {
    this.setState({
      idField: '',
      idFieldIsFilled: false,
      date: new Date().toISOString().split('T')[0],
      dateIsFilled: true,
      startTime: '',
      startTimeIsFilled: false,
      endTime: '',
      endTimeIsFilled: false,
      instructorList: [],
      selectedInstructor: '',
      selectedInstructorIsFilled: false,
      instructorsAreListed: false,
      wasSubmitted: false,
    });
  };

  displayState = () => {
    console.log(this.state);
    const ans = Array.isArray(this.state.instructorList);
    console.log(ans);
  };

  submit = () => {
    const url = 'http://localhost:8888/api/lessons/';
    if (
      this.state.idFieldIsFilled &&
      this.state.dateIsFilled &&
      this.state.startTimeIsFilled &&
      this.state.endTimeIsFilled &&
      this.state.selectedInstructorIsFilled
    ) {
      axios
        .post(url, {
          day: this.state.date,
          expected_start: String(`${this.state.startTime}:00`),
          expected_finish: String(`${this.state.endTime}:00`),
          student_id: this.state.idField,
          instructor_id: this.state.selectedInstructor,
        })
        .then(response => this.setState({ displaySuccess: true }, console.log(response)))
        .catch(error => {
          if (error.response.status === 409) {
            this.setState({ displayStudentConflict: true, displaySuccess: false });
          } else if (error.response.status === 404) {
            this.setState({ displayStudentNotFound: true, displaySuccess: false });
          }
        });
    } else {
      this.setState({ wasSubmitted: true });
    }
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.state.displaySuccess}
          onClose={this.closeSuccess}
          aria-labelledby="successDialogTitle"
          aria-describedby="successDialogDescription"
        >
          <DialogTitle id="successDialogTitle">Operação completada</DialogTitle>
          <DialogContent>
            <DialogContentText id="successDialogDescription">A aula foi agendada</DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.displayStudentNotFound}
          onClose={this.closeStudentNotFound}
          aria-labelledby="studentNotFoundDialogTitle"
          aria-describedby="studentNotFoundDialogDescription"
        >
          <DialogTitle id="studentNotFoundDialogTitle">Erro</DialogTitle>
          <DialogContent>
            <DialogContentText id="studentNotFoundDialogDescription">
              Aluno com o ID fornecido não está cadastrado
            </DialogContentText>
          </DialogContent>
        </Dialog>

        <Dialog
          open={this.state.displayStudentConflict}
          onClose={this.closeStudentConflict}
          aria-labelledby="studentConflictDialogTitle"
          aria-describedby="studentConflictDialogDescription"
        >
          <DialogTitle id="studentConflictDialogTitle">A aula não pôde ser marcada</DialogTitle>
          <DialogContent>
            <DialogContentText id="studentConflictDialogDescription">
              A marcação dessa aula gera conflito na grade horária deste aluno
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.displayInstructorConflict}
          onClose={this.closeInstructorConflict}
          aria-labelledby="instructorConflictDialogTitle"
          aria-describedby="instructorConflictDialogDescription"
        >
          <DialogTitle id="instructorConflictDialogTitle">A aula não pôde ser marcada</DialogTitle>
          <DialogContent>
            <DialogContentText id="instructorConflictDialogDescription">
              A marcação dessa aula gera conflito na grade horária deste instrutor
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <div className="container mt-3">
          <Typography component="h4" variant="h4" gutterBottom>
            Marcar aula
          </Typography>
          <Grid container spacing={16}>
            <Grid item lg={4}>
              <TextField
                id="TextField_id"
                label="ID do aluno"
                type="number"
                name="idField"
                required
                variant="outlined"
                margin="normal"
                fullWidth
                value={this.state.idField}
                onChange={this.handleChange}
                error={this.state.wasSubmitted && !this.state.idFieldIsFilled}
              />
            </Grid>
            <Grid item lg={4}>
              <TextField
                id="TextField_date"
                label="Data"
                type="date"
                name="date"
                required
                variant="outlined"
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }} // para não ocorrer sobreposição da label e do dd/mm/yyyy
                value={this.state.date}
                onChange={this.handleChange}
                error={this.state.wasSubmitted && !this.state.dateIsFilled}
              />
            </Grid>
            <Grid item lg={2}>
              <TextField
                id="TextField_startTime"
                label="Horário de início"
                type="time"
                name="startTime"
                required
                variant="outlined"
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }} // para não ocorrer sobreposição da label e do dd/mm/yyyy
                value={this.state.startTime}
                onChange={this.handleChange}
                error={this.state.wasSubmitted && !this.state.startTimeIsFilled}
              />
            </Grid>
            <Grid item lg={2}>
              <TextField
                id="TextField_endTime"
                label="Horário de término"
                type="time"
                name="endTime"
                required
                variant="outlined"
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }} // para não ocorrer sobreposição da label e do dd/mm/yyyy
                value={this.state.endTime}
                onChange={this.handleChange}
                error={this.state.wasSubmitted && !this.state.endTimeIsFilled}
              />
            </Grid>
          </Grid>
          <Grid container spacing={16} justify="space-between">
            <Grid item>
              <TextField
                id="TextField_selectedInstructor"
                select
                label="Instrutor"
                name="selectedInstructor"
                value={this.state.selectedInstructor}
                onChange={this.handleChange}
                style={{ width: '300px' }}
                error={this.state.wasSubmitted && !this.state.selectedInstructorIsFilled}
                variant="outlined"
              >
                {this.state.instructorList.map((instructor, index) => (
                  <MenuItem key={index} value={parseInt(instructor.split('-', 1), 10)}>
                    {instructor}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item>
              <Button onClick={this.displayState} />
            </Grid>
            <Grid item>
              <Button
                className="m1-3"
                variant="contained"
                onClick={this.submit}
                style={{
                  backgroundColor: '#2cad58',
                  color: 'white',
                  position: 'relative',
                  top: '15px',
                }}
              >
                Marcar aula
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default ScheduleLesson;
