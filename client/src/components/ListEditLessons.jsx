import React, { Component } from 'react';

import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { OutlinedInput, Select } from '@material-ui/core';

// ícones
import Help from '@material-ui/icons/Help';
import Edit from '@material-ui/icons/Edit';

class ListEditLessons extends Component {
  constructor() {
    super();
    this.state = {
      IDField: '',
      IDFieldIsFilled: '',
      ID: '',
      lessonList: [],
      completedLessonList: [],
      incompletedLessonList: [],
      lessonsAreListed: '',
      displayNotFound: false,
      displayDetailMenu: false,
      detailMenuLessonID: '',
      detailMenuExpectedStart: '',
      detailMenuExpectedFinish: '',
      detailMenuActualDuration: '',
      detailMenuStatus: '',
      detailMenuInstructorName: '',
      detailMenuComment: '',
      displayEditMenu: '',
      editMenuIsOpen: false,
      editMenuID: '',
      editMenuDate: new Date().toISOString().split('T')[0],
      editMenuDateIsFilled: true,
      editMenuStart: '',
      editMenuStartIsFilled: false,
      editMenuFinish: '',
      editMenuFinishIsFilled: false,
      editMenuInstructor: '',
      editMenuInstructorIsFilled: false,
      editSubmitted: false,
      editMenuInstructorList: [],
      instructorsAreListed: false,
      editMenuSelectedInstructor: '',
      editMenuSelectedInstructorIsFilled: false,
      displayUpdateSucces: false,
      updateWasSubmitted: false,
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

  getLessonList = () => {
    if (this.state.IDFieldIsFilled) {
      this.setState({ completedLessonList: [] }, this.setState({ incompletedLessonList: [] }));
      axios({
        method: 'get',
        url: `http://localhost:8888/api/students/${this.state.IDField}/lessons`,
      })
        .then(response => {
          console.log(`Lists being split. Length:${response.data.length}`);
          for (let i = 0; i < response.data.length; i += 1) {
            if (response.data[i].status === 4) {
              this.state.completedLessonList.push(response.data[i]);
            } else {
              this.state.incompletedLessonList.push(response.data[i]);
            }
          }
          this.setState({ lessonsAreListed: true }, this.setState({ ID: this.state.IDField }));
        })
        .catch(error => {
          console.log('Aluno não encontrado');
          if (error.response.status === 404) {
            this.setState({ displayNotFound: true }, this.setState({ lessonsAreListed: false }));
          }
        });
    }
  };

  closeSuccess = () => {
    this.setState({ displaySuccess: false }, this.updateLessonList());
  };

  updateLessonList = () => {
    axios({
      method: 'get',
      url: `http://localhost:8888/api/students/${this.state.ID}/lessons`,
    }).then(response => {
      console.log(response.data);
      this.setState({ lessonList: response.data }, this.setState({ lessonsAreListed: true }));
    });
  };

  displayNotFound = () => {
    this.setState({ displayNotFound: true });
  };

  closeNotFound = () => {
    this.setState({ displayNotFound: false });
  };

  openDetailPopup = (
    event,
    ID,
    day,
    expectedStart,
    expectedFinish,
    actualDuration,
    status,
    instructorName,
    grade,
    comment
  ) => {
    this.setState(
      { detailMenuLessonID: ID },
      this.setState(
        { detailMenuComment: comment },
        this.setState(
          { detailMenuDay: day },
          this.setState(
            { detailMenuExpectedStart: expectedStart },
            this.setState(
              { detailMenuExpectedFinish: expectedFinish },
              this.setState(
                { detailMenuActualDuration: actualDuration },
                this.setState(
                  { detailMenuStatus: status },
                  this.setState(
                    { detailMenuInstructorName: instructorName },
                    this.setState(
                      { detailMenuGrade: grade },
                      this.setState({ displayDetailMenu: true })
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  };

  closeDetailMenu = () => {
    this.setState({ displayDetailMenu: false });
  };

  stateOnConsole = () => {
    console.log(this.state);
  };

  openEditMenu = lessonID => {
    this.setState({ editMenuID: lessonID }, this.setState({ editMenuIsOpen: true }));
  };

  getAvailableInstructors = () => {
    if (
      this.state.editMenuStartIsFilled &&
      this.state.editMenuFinishIsFilled &&
      this.state.editMenuDateIsFilled
    ) {
      axios({
        method: 'get',
        url: 'http://localhost:8888/api/lessons/availableinstructors',
        headers: { 'Content-Type': 'application/json' },
        params: {
          day: String(this.state.editMenuDate),
          start: String(`${this.state.editMenuStart}:00`),
          finish: String(`${this.state.editMenuFinish}:00`),
        },
      }).then(response =>
        this.setState({ editMenuInstructorList: response.data }, () =>
          this.setState({ instructorsAreListed: true }, () => console.log(response.data))
        )
      );
    } else {
      this.setState({ editMenuSelectedInstructorIsFilled: false }, () =>
        this.setState({ editMenuInstructorList: [] })
      );
    }
  };

  updateLesson = () => {
    if (
      this.state.editMenuDateIsFilled &&
      this.state.editMenuFinishIsFilled &&
      this.state.editMenuInstructorIsFilled &&
      this.state.editMenuStartIsFilled
    ) {
      const url = `http://localhost:8888/api/lessons/${this.state.editMenuID}`;
      axios
        .put(url, {
          day: this.state.editMenuDate,
          expected_start: this.state.editMenuStart,
          expected_finish: this.state.editMenuFinish,
          instructor_id: this.state.editMenuInstructor,
        })
        .then(response => {
          console.log(response.data);
          this.setState({ displayUpdateSuccess: true });
        });
    } else {
      this.setState({ updateWasSubmitted: true });
    }
  };

  closeUpdateSuccessDialog = () =>{
    this.setState({ displayUpdateSucces: false });
  }

  render() {
    let completedLessonsTable;
    completedLessonsTable = this.state.completedLessonList.map((lesson, index) => (
      <TableRow key={index}>
        <TableCell align="center">{lesson.ID}</TableCell>
        <TableCell align="center">{lesson.day}</TableCell>
        <TableCell align="center">{lesson.expected_start}</TableCell>
        <TableCell align="center">{lesson.expected_finish}</TableCell>
        <TableCell align="center">
          <IconButton
            color="primary"
            onClick={event =>
              this.openDetailPopup(
                event,
                lesson.ID,
                lesson.day,
                lesson.expected_start,
                lesson.expected_finish,
                lesson.actual_duration,
                lesson.status,
                lesson.instructor.name,
                lesson.grade,
                lesson.comment
              )
            }
            style={{ position: 'relative', top: '-2px' }}
          >
            <Help />
          </IconButton>
        </TableCell>
      </TableRow>
    ));

    let incompletedLessonsTable;
    incompletedLessonsTable = this.state.incompletedLessonList.map((lesson, index) => (
      <TableRow key={index}>
        <TableCell align="center">{lesson.ID}</TableCell>
        <TableCell align="center">{lesson.day}</TableCell>
        <TableCell align="center">{lesson.expected_start}</TableCell>
        <TableCell align="center">{lesson.expected_finish}</TableCell>
        <TableCell align="center">
          <IconButton
            color="primary"
            onClick={event => this.openEditMenu(event, lesson.ID)}
            style={{ position: 'relative', top: '-2px' }}
          >
            <Edit />
          </IconButton>
        </TableCell>
      </TableRow>
    ));

    let editMenu;
    if (this.state.editMenuIsOpen) {
      editMenu = (
        <div>
          <Typography component="h6" variant="h6" gutterBottom>
            Remarcar aula
          </Typography>
          <Grid container spacing={16}>
            <Grid item>
              <TextField
                id="TextField_editMenuDate"
                label="Data"
                type="date"
                name="editMenuDate"
                required
                variant="outlined"
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }} // para não ocorrer sobreposição da label e do dd/mm/yyyy
                value={this.state.editMenuDate}
                onChange={this.handleChange}
                error={this.state.editSubmitted && !this.state.editMenuDateIsFilled}
              />
            </Grid>
            <Grid item>
              <TextField
                id="TextField_editMenuStart"
                label="Horário de início"
                type="time"
                name="editMenuStart"
                required
                variant="outlined"
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }} // para não ocorrer sobreposição da label e do dd/mm/yyyy
                value={this.state.editMenuStart}
                onChange={this.handleChange}
                error={this.state.editSubmitted && !this.state.editMenuStartIsFilled}
              />
            </Grid>
            <Grid item>
              <TextField
                id="TextField_editMenuFinish"
                label="Horário de término"
                type="time"
                name="editMenuFinish"
                required
                variant="outlined"
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }} // para não ocorrer sobreposição da label e do dd/mm/yyyy
                value={this.state.editMenuFinish}
                onChange={this.handleChange}
                error={this.state.editSubmitted && !this.state.editMenuFinishIsFilled}
              />
            </Grid>
            <Grid item style={{ position: 'relative', top: '16px' }}>
              <TextField
                id="TextField_editMenuInstructor"
                select
                label="Instrutor"
                name="editMenuInstructor"
                value={this.state.editMenuInstructor}
                onChange={this.handleChange}
                style={{ width: '300px' }}
                error={this.state.editSubmitted && !this.state.editMenuInstructorIsFilled}
                variant="outlined"
              >
                {this.state.editMenuInstructorList.map((instructor, index) => (
                  <MenuItem key={index} value={parseInt(instructor.split('-', 1), 10)}>
                    {instructor}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item style={{ position: 'relative', top: '10px' }}>
              <Button
                className="m1-3"
                variant="contained"
                onClick={this.updateLesson}
                style={{
                  backgroundColor: '#2cad58',
                  color: 'white',
                  position: 'relative',
                  top: '15px',
                }}
              >
                Remarcar aula
              </Button>
            </Grid>
          </Grid>
        </div>
      );
    } else {
      editMenu = '';
    }

    return (
      <div className="container mt-3">
        <Typography component="h4" variant="h4" gutterBottom>
          Consulta de aulas
        </Typography>
        <Dialog
          open={this.state.displayUpdateSuccess}
          onClose={this.closeUpdateSuccessDialog}
          aria-labelledby="updateSuccessDialogTitle"
          aria-describedby="udpateSuccessDialogDescription"
        >
          <DialogTitle id="updateSuccessDialogTitle">Operação completada</DialogTitle>
          <DialogContent>
            <DialogContentText id="deleteSuccessDialogDescription">
              Aula remarcada com sucesso
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.displayNotFound}
          onClose={this.closeNotFound}
          aria-labelledby="notFoundDialogTitle"
          aria-describedby="notFoundDialogDescription"
        >
          <DialogTitle id="notFoundDialogTitle">Erro</DialogTitle>
          <DialogContent>
            <DialogContentText id="notFoundDialogDescription">
              O aluno com o ID fornecido não está cadastrado
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.displayDetailMenu}
          onClose={this.closeDetailMenu}
          aria-labelledby="detailDialogTitle"
        >
          <DialogTitle id="detailDialogTitle">
            Detalhes da aula {this.state.detailMenuLessonID}
          </DialogTitle>
          <DialogContent>
            <p>
              <br />
            </p>
            <Grid container spacing={16} direction="column">
              <Grid item>Data: {this.state.detailMenuDay}</Grid>
              <Grid item>Horário de início: {this.state.detailMenuExpectedStart}</Grid>
              <Grid item>Horário de término: {this.state.detailMenuExpectedFinish}</Grid>
              <Grid item>Instrutor: {this.state.detailMenuInstructorName}</Grid>
              <Grid item>Parecer: {this.state.detailMenuGrade}</Grid>
              <Grid item>Comentários: {this.state.detailMenuComment}</Grid>
              <Grid item>Duração da aula: {this.state.detailMenuActualDuration}</Grid>
              <Grid />
            </Grid>
          </DialogContent>
        </Dialog>
        <Grid container spacing={16}>
          <Grid item style={{ position: 'relative', top: '-10px' }}>
            <TextField
              id="TextField_IDField"
              label="ID do aluno"
              type="number"
              name="IDField"
              required
              variant="outlined"
              margin="normal"
              value={this.state.IDField}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item>
            <Button
              className="m1-3"
              variant="contained"
              onClick={this.getLessonList}
              style={{
                backgroundColor: '#2cad58',
                color: 'white',
                position: 'relative',
                top: '15px',
              }}
            >
              Listar aulas
            </Button>
          </Grid>
          <Grid item>
            <Button
              className="m1-3"
              onClick={this.stateOnConsole}
              variant="contained"
              stule={{ position: 'relative', top: '15px' }}
            >
              Estado no console
            </Button>
          </Grid>
        </Grid>
        {!this.state.lessonsAreListed ? (
          ' '
        ) : (
          <div>
            <Typography component="h6" variant="h6" gutterBottom>
              Aulas encerradas
            </Typography>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">ID da aula</TableCell>
                    <TableCell align="center">Data</TableCell>
                    <TableCell align="center">Início previsto</TableCell>
                    <TableCell align="center">Término previsto</TableCell>
                    <TableCell align="center">Exibir detalhes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{completedLessonsTable}</TableBody>
              </Table>
            </Paper>
          </div>
        )}
        {!this.state.lessonsAreListed ? (
          ' '
        ) : (
          <div>
            <Typography component="h6" variant="h6" gutterBottom>
              Aulas pendentes
            </Typography>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">ID da aula</TableCell>
                    <TableCell align="center">Data</TableCell>
                    <TableCell align="center">Início previsto</TableCell>
                    <TableCell align="center">Término previsto</TableCell>
                    <TableCell align="center">Remarcar aula</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{incompletedLessonsTable}</TableBody>
              </Table>
            </Paper>
          </div>
        )}
        {editMenu}
      </div>
    );
  }
}

export default ListEditLessons;
