import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
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
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
// ícones
import Edit from '@material-ui/icons/Edit';
import CheckCircle from '@material-ui/icons/CheckCircle';

import axios from 'axios';
import { OutlinedInput } from '@material-ui/core';

class EvaluateLesson extends Component {
  constructor() {
    super();
    this.state = {
      instructorID: String(JSON.parse(localStorage.getItem('ID'))),
      lessonsAreListed: false,
      lessonList: [],
      evaluationMenuIsOpen: false,
      evaluationMenuLessonID: '',
      grade: '',
      gradeIsFilled: '',
      comment: '',
      commentIsFilled: '',
      displaySuccess: false,
      duration: '',
      durationIsFilled: false,
      displayNotFound: false,
      evaluationWasSubmitted: false,
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
      this.setState({ [fieldNameIsFilled]: true });
    } else {
      this.setState({ [fieldNameIsFilled]: false });
    }
  };

  getLessonList = () => {
    axios({
      method: 'get',
      url: `https://cors-anywhere.herokuapp.com/http://ec2-18-212-165-41.compute-1.amazonaws.com/api/instructors/${this.state.instructorID}/lessons`,
    })
      .then(response => {
        console.log(response.data);
        this.setState({ lessonList: response.data }, this.setState({ lessonsAreListed: true }));
      })
      .catch(error => {
        if (error.response.status === 404) {
          this.setState({ displayNotFound: true }, this.setState({ lessonsAreListed: false }));
        }
      });
  };

  openEvaluationPopup = (event, lessonID) => {
    this.setState(
      { evaluationMenuLessonID: lessonID },
      this.setState(
        { evaluationMenuIsOpen: true },
        console.log(`ID da aula selecionada: ${lessonID}`)
      )
    );
  };

  closeEvaluationMenu = () => {
    this.setState({ evaluationMenuIsOpen: false }, this.getLessonList());
  };

  submitEvaluation = () => {
    if (this.state.durationIsFilled && this.state.gradeIsFilled) {
      const url = `https://cors-anywhere.herokuapp.com/http://ec2-18-212-165-41.compute-1.amazonaws.com/api/lessons/${this.state.evaluationMenuLessonID}`;
      const duracaoFormatada = `${this.state.duration}:00`;
      let commentToAdd = 'Nenhum comentário adicionado';
      if (this.state.commentIsFilled) {
        commentToAdd = this.state.comment;
      }
      axios
        .put(url, {
          actual_duration: duracaoFormatada,
          comment: commentToAdd,
          grade: this.state.grade,
          status: 4,
        })
        .then(response => {
          console.log(response.data.endpoint);
          this.setState({ displaySuccess: true }, this.closeEvaluationMenu());
        });
    } else {
      this.setState({ evaluationWasSubmitted: true });
    }
  };

  closeSuccess = () => {
    this.setState({ displaySuccess: false }, this.updateLessonList());
  };

  updateLessonList = () => {
    axios({
      method: 'get',
      url: `https://cors-anywhere.herokuapp.com/http://ec2-18-212-165-41.compute-1.amazonaws.com/api/instructors/${this.state.instructorID}/lessons`,
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

  render() {
    return (
      <div className="container mt-3">
        <Typography component="h4" variant="h4" gutterBottom>
          Lista de aulas
        </Typography>
        <Grid container spacing={16}>
          <Grid item>
            {!this.state.lessonsAreListed ? (
              ''
            ) : (
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">ID da aula</TableCell>
                      <TableCell align="center">Aluno</TableCell>
                      <TableCell align="center">Data</TableCell>
                      <TableCell align="center">Início previsto</TableCell>
                      <TableCell align="center">Término previsto</TableCell>
                      <TableCell align="center">Avaliar aula</TableCell>
                      <TableCell align="center">Nota</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.lessonList.map(lesson => (
                      <TableRow key={lesson.ID}>
                        <TableCell align="center">{lesson.ID}</TableCell>
                        <TableCell align="center">{lesson.student.name}</TableCell>
                        <TableCell align="center">{lesson.day}</TableCell>
                        <TableCell align="center">
                          {lesson.expected_start.substring(0, 5)}
                        </TableCell>
                        <TableCell align="center">
                          {lesson.expected_finish.substring(0, 5)}
                        </TableCell>
                        <TableCell align="center">
                          {lesson.status === 4 ? (
                            <Icon color="primary" style={{ position: 'relative', top: '-2px' }}>
                              <CheckCircle />
                            </Icon>
                          ) : (
                            <IconButton
                              color="primary"
                              onClick={event => this.openEvaluationPopup(event, lesson.ID)}
                              style={{ position: 'relative', top: '-2px' }}
                            >
                              <Edit />
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {lesson.status === 4 ? <div>{lesson.grade}</div> : <div>-</div>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            )}
          </Grid>
        </Grid>
        <Dialog
          open={this.state.displayNotFound}
          onClose={this.closeNotFound}
          aria-labelledby="notFoundDialogTitle"
          aria-describedby="notFoundDialogDescription"
        >
          <DialogTitle id="notFoundDialogTitle">Erro</DialogTitle>
          <DialogContent>
            <DialogContentText id="notFoundDialogDescription">
              O instrutor com o ID fornecido não está cadastrado
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.displaySuccess}
          onClose={this.closeSuccess}
          aria-labelledby="successDialogTitle"
          aria-describedby="successDialogDescription"
        >
          <DialogTitle id="successDialogTitle">Operação completada</DialogTitle>
          <DialogContent>
            <DialogContentText id="successDialogDescription">
              Aula avaliada com sucesso
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.evaluationMenuIsOpen}
          onClose={this.closeEvaluationMenu}
          aria-labelledby="evaluationMenuTitle"
          aria-describedby="evaluationMenuTitle"
          maxWidth="false"
        >
          <DialogTitle id="evaluationMenuTitle">Avaliação da aula</DialogTitle>
          <DialogContent>
            <p>
              <br />
            </p>
            <Grid container spacing={16} direction="column">
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <TextField
                  id="TextField_duration"
                  label="Duração (hh:mm)"
                  type="time"
                  name="duration"
                  variant="outlined"
                  required
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }} // para não ocorrer sobreposição da label e do dd/mm/yyyy
                  value={this.state.duration}
                  onChange={this.handleChange}
                  error={this.state.evaluationWasSubmitted && !this.state.durationIsFilled}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <FormControl
                  variant="outlined"
                  style={{ minWidth: 100 }}
                  error={this.state.evaluationWasSubmitted && !this.state.gradeIsFilled}
                >
                  <InputLabel>Nota</InputLabel>
                  <Select
                    name="grade"
                    value={this.state.grade}
                    onChange={this.handleChange}
                    input={<OutlinedInput name="Nota" labelWidth={100} />}
                  >
                    <option value="" />
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <TextField
                  id="TextField_commment"
                  label="Comentários"
                  multiline
                  rows="4"
                  name="comment"
                  margin="normal"
                  value={this.state.commment}
                  onChange={this.handleChange}
                  style={{ minWidth: 600 }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button
                  className="m1-3"
                  variant="contained"
                  fullWidth
                  onClick={this.submitEvaluation}
                  style={{
                    backgroundColor: '#2cad58',
                    color: 'white',
                    position: 'relative',
                    top: '15px',
                  }}
                >
                  Avaliar
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default EvaluateLesson;
