import React, { Component } from 'react';

import axios from 'axios';

import {
  TextField,
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Button,
  IconButton,
  MenuItem,
  LinearProgress,
  Tooltip,
  withStyles,
} from '@material-ui/core/';

// ícones
import Help from '@material-ui/icons/Help';
import Edit from '@material-ui/icons/Edit';

class ListEditLessons extends Component {
  constructor() {
    super();
    this.state = {
      ID: String(JSON.parse(localStorage.getItem('ID'))),
      completeLessonList: [],
      incompleteLessonList: [],
      flightTime: '',
      courseDuration: '',
      lessonsAreListed: '',
      displayNotFound: false,
      displayDetailMenu: false,
      detailMenuLessonID: '',
      detailMenuExpectedStart: '',
      detailMenuExpectedFinish: '',
      detailMenuActualDuration: '',
      detailMenuInstructorName: '',
      detailMenuComment: '',
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
      displayUpdateSuccess: false,
      displayConflict: false,
      displayAlert: true,
    };
    this.getLessonList();
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
    this.setState({ completeLessonList: [] }, this.setState({ incompleteLessonList: [] }));
    axios({
      method: 'get',
      url: `http://localhost:8888/api/students/${this.state.ID}/lessons`,
    })
      .then(response => {
        console.log(`Lists being split. Length:${response.data.length}`);
        const complete = [];
        const incomplete = [];
        for (let i = 0; i < response.data.length; i += 1) {
          if (response.data[i].status === 4) {
            complete.push(response.data[i]);
          } else {
            incomplete.push(response.data[i]);
          }
        }
        this.setState({ completeLessonList: complete }, () =>
          this.setState({ incompleteLessonList: incomplete }, () =>
            this.setState({ lessonsAreListed: true })
          )
        );
      })
      .catch(error => {
        console.log('Aluno não encontrado');
        if (error.response.status === 404) {
          this.setState({ displayNotFound: true }, this.setState({ lessonsAreListed: false }));
        }
      });
    axios({
      method: 'get',
      url: `http://localhost:8888/api/students/${this.state.ID}`,
    }).then(response => {
      console.log('Dados do aluno: \r\n');
      console.log(response.data);
      this.setState({
        flightTime: response.data.flightTime,
        courseDuration: response.data.courseDuration,
      });
    });
  };

  closeSuccess = () => {
    this.setState({ displaySuccess: false }, this.updateLessonList());
  };

  updateLessonList = () => {
    axios({
      method: 'get',
      url: `http://localhost:8888/api/students/${this.state.ID}/lessons`,
    }).then(response => {
      console.log(`Lists being split. Length:${response.data.length}`);
      const complete = [];
      const incomplete = [];
      for (let i = 0; i < response.data.length; i += 1) {
        if (response.data[i].status === 4) {
          complete.push(response.data[i]);
        } else {
          incomplete.push(response.data[i]);
        }
      }
      this.setState({ completeLessonList: complete }, () =>
        this.setState({ incompleteLessonList: incomplete })
      );
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
    instructorName,
    grade,
    comment
  ) => {
    this.setState({
      detailMenuLessonID: ID,
      detailMenuComment: comment,
      detailMenuDay: day,
      detailMenuExpectedStart: expectedStart,
      detailMenuExpectedFinish: expectedFinish,
      detailMenuActualDuration: actualDuration,
      detailMenuInstructorName: instructorName,
      detailMenuGrade: grade,
      displayDetailMenu: true,
    });
  };

  closeDetailMenu = () => {
    this.setState({ displayDetailMenu: false });
  };

  openEditMenu = (event, lessonID) => {
    this.setState({ editMenuID: lessonID, editMenuIsOpen: true });
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
      }).then(response => {
        this.setState({ editMenuInstructorList: response.data }, () => console.log(response.data));
      });
    } else {
      this.setState({ editMenuInstructorIsFilled: false }, () =>
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
      const url = `http://localhost:8888/api/lessons/${String(this.state.editMenuID)}`;
      axios
        .put(url, {
          day: this.state.editMenuDate,
          expected_start: `${this.state.editMenuStart}:00`,
          expected_finish: `${this.state.editMenuFinish}:00`,
          instructor_id: this.state.editMenuInstructor,
        })
        .then(response => {
          console.log(response.data);
          this.setState({ displayUpdateSuccess: true, editSubmitted: false });
        })
        .catch(error => {
          if (error.response.status === 409) {
            console.log('Conflito na grade do aluno');
            this.setState({ displayConflict: true });
          }
        });
    } else {
      this.setState({ editSubmitted: true });
    }
  };

  closeUpdateSuccessDialog = () => {
    this.setState(
      {
        displayUpdateSuccess: false,
        editMenuIsOpen: false,
        editMenuDate: new Date().toISOString().split('T')[0],
        editMenuStart: '',
        editMenuStartIsFilled: false,
        editMenuFinish: '',
        editMenuFinishIsFilled: false,
        editMenuInstructor: '',
        editMenuInstructorIsFilled: false,
      },
      () => this.updateLessonList()
    );
  };

  closeConflictDialog = () => {
    this.setState({ displayConflict: false });
  };

  closeAlert = () => {
    this.setState({ displayAlert: false });
  };

  render() {
    let completeLessonsTable;
    completeLessonsTable = this.state.completeLessonList.map((lesson, index) => (
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

    let incompleteLessonsTable;
    incompleteLessonsTable = this.state.incompleteLessonList.map((lesson, index) => (
      <TableRow key={index}>
        <TableCell align="center">{lesson.ID}</TableCell>
        <TableCell align="center">{lesson.day}</TableCell>
        <TableCell align="center">{lesson.expected_start}</TableCell>
        <TableCell align="center">{lesson.expected_finish}</TableCell>
        <TableCell align="center">{lesson.instructor.name}</TableCell>
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
            Remarcar aula {this.state.editMenuID}
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

    let flightProgressBar;
    const flightHours = Math.floor(this.state.flightTime / 3600); // divisão inteira
    const flightMinutes = (this.state.flightTime % 3600) / 60;
    const threshold = this.state.courseDuration * 3600; // 1courseDuration está em horas

    let tooltipMessage;

    if (this.state.flightTime <= threshold) {
      // o valor de flightTime é em segundos
      flightProgressBar = 100 * (this.state.flightTime / threshold);
      tooltipMessage = `Tempo de voo acumulado: ${flightHours}h${flightMinutes}min (${flightProgressBar}% de um total de ${
        this.state.courseDuration
      }h)`;
    } else {
      flightProgressBar = 100;
      tooltipMessage = `Tempo de voo acumulado: ${flightHours}h${flightMinutes}min (${flightProgressBar}% +)`;
    }

    const ColoredLinearProgress = withStyles({
      root: {
        height: 15,
      },
      bar: {
        borderRadius: 20,
        backgroundColor: '#2cad58',
      },
    })(LinearProgress);

    return (
      <div className="container mt-3">
        <Dialog
          open={this.state.displayConflict}
          onClose={this.closeConflictDialog}
          aria-labelledby="conflictDialogTitle"
          aria-describedby="conflictDialogDescription"
        >
          <DialogTitle id="conflictDialogTitle">Erro</DialogTitle>
          <DialogContent>
            <DialogContentText id="conflictDialogDescription">
              A remarcação gera conflito na grade horária do aluno
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
        <Dialog
          open={this.state.displayAlert && flightProgressBar >= 100}
          onClose={this.closeAlert}
          aria-labelledby="alertDialogTitle"
          aria-describedby="alertDialogDescription"
        >
          <DialogTitle id="alertDialogTitle">Parabéns</DialogTitle>
          <DialogContent>
            <DialogContentText id="alertDialogDescription">
              Você completou as horas de voo necessárias para emissão do seu brevê. Contate o
              administrador para obtê-lo
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Typography component="h4" variant="h4" gutterBottom>
          Consulta de aulas
        </Typography>
        {!this.state.lessonsAreListed ? (
          ' '
        ) : (
          <div>
            <Typography component="h6" variant="h6" gutterBottom>
              Progresso
            </Typography>
            <Tooltip title={tooltipMessage} placement="top">
              <ColoredLinearProgress variant="determinate" value={flightProgressBar} />
            </Tooltip>
            <Typography component="h6" variant="h6" gutterBottom style={{ marginTop: 30 }}>
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
                <TableBody>{completeLessonsTable}</TableBody>
              </Table>
            </Paper>
          </div>
        )}
        {!this.state.lessonsAreListed ? (
          ' '
        ) : (
          <div>
            <Typography component="h6" variant="h6" gutterBottom style={{ marginTop: 30 }}>
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
                    <TableCell align="center">Instrutor</TableCell>
                    <TableCell align="center">Remarcar aula</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{incompleteLessonsTable}</TableBody>
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
