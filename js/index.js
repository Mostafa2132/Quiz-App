/*
1- select all inputs 
2- get data from selected inputs
3- class for Quiz 
4- create Api --->  Open Trivia Database
5- fetch api
** asyn function -----> return promise
6- fetch  return ---> all questions 
-----------------------------------------------------
1- class for questions ---> index
2- inside constructor -----> this.correctAnswer = allquestions[index].correctAnswer (all things i need in this index of questions)
3- uncorrectAnswer return in array ----> 
4- create function allAnsw -----> let arr = [...uncorrectAnswer , correctAnswer]  -----> return arr.sort()
5- create function for display -----> 
 *** for display li -----> ${this.allAnsw().map((x)=>{
        return `<li>${x}</li>   ----> x,y -- for disappear , ----> join(" ")
    }) . join(" ")}

6- select all li after display  ----> add event --> call fun this.checkclick(ele)
** before it we create this.flag = false in class 
7- checkclick(li) --> { if(!this.flag)
  this.flag = true;
 if(this.correct-ans == li.innerHtml) {
 li.classlist.add("correct")
 quiz.score ++
  }else{
 li.classlist.add("wrong")

} }

----------------------------------------------------------------------------------
 display next question
 1- next question()
*/

let categoryMenu = document.querySelector("#categoryMenu");
let difficultyOptions = document.querySelector("#difficultyOptions");
let questionsNumber = document.querySelector("#questionsNumber");
let allquestions;

let quiz;

document.getElementById("startQuiz").addEventListener("click", async () => {
  let category = categoryMenu.value;
  let difficulty = difficultyOptions.value;
  let questions = questionsNumber.value;
  quiz = new Quiz(category, difficulty, questions);
  allquestions = await quiz.fetchAPI();
  document.getElementById("quizOptions").classList.replace("d-block", "d-none");
  document.getElementById("myData").classList.replace("d-none", "d-block");
  let question = new Question(0);
  question.displayAnswers();
});

class Quiz {
  constructor(category, difficulty, questionsNum) {
    this.category = category;
    this.difficulty = difficulty;
    this.questions = questionsNum;
    this.score = 0;
  }

  displayScore() {
    let x = `
                <h2 class="mb-0">  ${
                  this.score == allquestions.length
                    ? `Congratulation your score is ${this.score} of ${allquestions.length}`
                    : `OOOOOOPS your score is ${this.score} of ${allquestions.length}`
                }  </h2>
            <button class="again btn btn-primary rounded-pill"> <i class="bi bi-arrow-repeat" ></i> try Again </button>
    
    `;
    document.getElementById("finish").innerHTML = x;
    document.querySelector(".again").addEventListener("click", function(){
        setTimeout(function(){
            location.reload();
        },1500)
    })
    document.querySelector("#myData").classList.replace("d-block", "d-none");
    document.querySelector("#finish").classList.replace("d-none", "d-block");
  }
  getApi() {
    return `https://opentdb.com/api.php?amount=${this.questions}&category=${this.category}&difficulty=${this.difficulty}`;
  }
  async fetchAPI() {
    let res = await fetch(this.getApi());
    let data = await res.json();
    return data.results;
  }
}

class Question {
  constructor(index) {
    this.index = index;
    this.question = allquestions[index].question;
    this.category = allquestions[index].category;
    this.correct_answer = allquestions[index].correct_answer;
    this.incorrect_answers = allquestions[index].incorrect_answers;
    // console.log(this.correct_answer);

    this.flag = false;
  }

  getAllAnswers() {
    let arr = [...this.incorrect_answers, this.correct_answer];
    arr.sort();
    return arr;
  }
  displayAnswers() {
    let x = `
                  <div class="w-100 d-flex justify-content-between">
            <span class="h5 btn-category">${this.category}</span>
            <span class="h5 btn-questions"> ${this.index + 1} of ${
      allquestions.length
    }</span>
          </div>
          <h2 class="text-capitalize h4 text-center ">${this.question}</h2>
          <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
                ${this.getAllAnswers()
                  .map((x) => {
                    return `<li>${x}</li>`;
                  })
                  .join(" ")}       
          </ul>
          <h2 class="text-center">Score : ${quiz.score} </h2>
        `;

    document.getElementById("myData").innerHTML = x;
    let allLi = document.querySelectorAll("#myData ul li");
    allLi.forEach((ele) => {
      ele.addEventListener("click", () => {
        this.checkAnswer(ele);
      });
    });
  }
  checkAnswer(li) {
    if (!this.flag) {
      this.flag = true;
      if (this.correct_answer == li.innerHTML) {
        li.classList.add("correct");
        quiz.score++;
      } else {
        li.classList.add("wrong");
      }
      setTimeout(() => {
        this.nextQuestion();
      }, 2000);
    }
  }

  nextQuestion() {
    this.index++;
    if (this.index < allquestions.length) {
      let ques = new Question(this.index);
      ques.displayAnswers();
    } else {
      setTimeout(() => {
        quiz.displayScore();
      }, 2000);
    }
  }
}
