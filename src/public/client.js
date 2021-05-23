let store = {
  currentTab: "spirit",
  rover: {},
  apod: [],
};

// add our markup to the page
const root = document.getElementById("root");
const tabs = document.querySelectorAll(".tab");

const activeTab = (tabs, currentTab) => {
  tabs.forEach((tab) => {
    if (tab.id === currentTab) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });
};

const initial = async (tabs, store) => {
  tabs.forEach((tab) => {
    tab.addEventListener("click", async (e) => {
      const currentTab = e.target.id;
      updateStore(store, { currentTab: currentTab });
      activeTab(tabs, currentTab);
      fetchData(store, currentTab);
    });
  });
};

const fetchData = async (store, currentTab) => {
  getRover(store, currentTab);
  getApod(store, currentTab);
};

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state, renderRover, renderApod);
};

// App() is a higher order function-
const App = (state, renderRover, renderApod) => {
  const { rover, apod } = state;

  return Elements(rover, apod, renderRover, renderApod);
};

//  Higher order function-
const Elements = (rover, apod, generateRover, generateApod) => {
  const roverElements = generateRover(rover);
  const apodElements = generateApod(apod);
  return `
        <div>
            <div class="rover-container">
                ${roverElements}
            </div>
            <section class="apod-container">
                ${apodElements}
            </section>
        </div>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", async () => {
  initial(tabs, store);
  await fetchData(store, "spirit");
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional roverrmation --
const renderRover = () => {
  return `
        <figure>
            <h1><b>Learn more about <a href="https://mars.nasa.gov/mer/">Rovers</a> </b></h1>
        </figure>
    `;
};

// A pure function that renders apods requested from the backend
const renderApod = (apods) => {
  let apodText = ``;

  // here map() is also a higher order function
  apods.slice(0, 4).map((apod) => {

    apodText += `
                    <figure class="apod-card">
                        <img src="${apod.img_src}" alt="Rover apod" class="rover-apod"/>
                        <figcaption>
                            <span><b>Sol (Mars days):</b> ${apod.sol}</span><br/>
                            <span><b>Earth date:</b> ${apod.earth_date}</span><br />
                        </figcaption>
                    </figure>`;
  });
  return apodText;
};

// ----------------------------------------------  API CALLS

const getRover = (store, roverName) => {
  fetch(`http://localhost:3000/rovers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roverName: roverName }),
  })
    .then((res) => res.json())
    .then((rover) => updateStore(store, { rover: rover }));
};

const getApod = (store, roverName) => {
  fetch(`http://localhost:3000/fetchImage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roverName: roverName }),
  })
    .then((res) => res.json())
    .then((apod) => updateStore(store, { apod: apod }));
};