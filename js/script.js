class App {
  constructor() {
    this.allUsers = [];
    this.usersSearched = [];

    this.countMales = 0;
    this.countFemales = 0;
    this.ageSum = 0;
    this.ageAvarage = 0;
    this.target = null;

    this.$usersCount = document.querySelector('#usersCount');
    this.$tabUsers = document.querySelector('#tabUsers');
    this.$statsCount = document.querySelector('#statsCount');
    this.$tabStatistics = document.querySelector('#tabStatistics');
    this.$userInput = document.querySelector('#userInput');
    this.$submitButton = document.querySelector('#submitButton');

    this.fetchUsers();
    this.EventListeners();
    this.render();
    this.screenCheck();
    this.handleCounters();
  }
  //-----------------------------------------------------
  async fetchUsers() {
    // prettier-ignore
    const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
    const json = await res.json();
    this.allUsers = json.results.map((user) => {
      const { name, gender, dob, picture } = user;
      return {
        name: name,
        gender,
        age: dob.age,
        picture: picture.large,
      };
    });
  }
  //-----------------------------------------------------
  EventListeners() {
    this.$userInput.addEventListener('keyup', (event) => {
      this.target = event.target.value.toLowerCase();
      this.render(this.target);
    });
    this.$submitButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.render(this.target);
    });
  }
  //---------------------------------------------------
  render(value) {
    this.renderUsers(value);
    this.screenCheck(value);
    this.handleCounters(value);
    this.calcStatistics();
  }
  //---------------------------------------------------

  renderUsers(value) {
    let usersHTML = '<div>';

    this.usersSearched = [];
    this.usersSearched = this.allUsers.filter((user) => {
      return (
        user.name.first.toLowerCase().includes(value) ||
        user.name.last.toLowerCase().includes(value)
      );
    });

    this.usersSearched.forEach((user) => {
      const { name, gender, age, picture } = user;
      let searchedHTML = `
      <div class = "user">
      <div>
      <img src="${picture}" alt="${name}">
      </div>
      <div>
      <ul>
      <li>${name.first} ${name.last} </li>
      <li>${age} Anos</li>
      </ul>
      </div>
      </div>
      `;
      usersHTML += searchedHTML;
    });
    usersHTML += '</div>';
    this.$tabUsers.innerHTML = usersHTML;

    this.screenCheck();
  }
  // Checks if the input is empty and clears the Statistics Screen
  screenCheck(value) {
    if (value === '') {
      this.usersSearched = [];
      this.$tabUsers.innerHTML = '<div></div>';
    }
  }
  //-------------------------------------------------
  handleCounters() {
    if (this.usersSearched.length > 0) {
      this.$usersCount.innerHTML = `<span class="grey-text text-darken-4">${this.usersSearched.length} Usuário(s) Encontrado(s) </span>`;
    } else {
      this.$usersCount.innerHTML = `<span>Nada a ser exibido</span>`;
    }
  }
  //---------------------------------------------------
  calcStatistics() {
    this.countMales = this.usersSearched.filter(
      (user) => user.gender === 'male'
    );
    this.countFemales = this.usersSearched.filter(
      (user) => user.gender === 'female'
    );
    this.ageSum = this.usersSearched.reduce((acc, curr) => acc + curr.age, 0);
    this.ageAvarage = parseFloat(
      this.ageSum / this.usersSearched.length
    ).toFixed(2);
    this.renderStatistics();
  }
  //---------------------------------------------------
  renderStatistics() {
    if (this.usersSearched.length > 0) {
      this.$statsCount.innerHTML = `<div><span>Estatísticas:</span></div>`;
      this.$tabStatistics.innerHTML = `
    <div>
    Homens: ${this.countMales.length}
    </div>
    <div>
    Mulheres: ${this.countFemales.length}
    </div>
    <div>
    Somatório das idades: ${this.ageSum}
    </div>
    <div>
    Média das Idades: ${this.ageAvarage}
    </div>
    `;
    } else {
      this.$statsCount.innerHTML = `<div><span>Nada a ser exibido</span></div>`;
      this.$tabStatistics.innerHTML = '<div>';
    }
  }
}
new App();
