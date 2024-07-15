//import { navigateTo } from "../router.js";
import { data } from "../data/dataset.js";
import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";
import { Cards } from "../components/Cards.js";
import { filterData, sortData, } from "../lib/dataFunctions.js";

const rootElement = document.getElementById("root");
rootElement.insertAdjacentElement("beforebegin", Header());
rootElement.insertAdjacentElement("afterend", Footer());

export function Home() {
  return Cards(data);
} 

function resetSelectIndex(...selectElements) {
  selectElements.forEach((selectElement) => {
    selectElement.selectedIndex = 0;
  });
}

function applyFilterAndSort(activeFilter, inactiveFilter, orderSelect) {
  let filteredData = data;
  if (activeFilter.value) {
    filteredData = filterData(
      filteredData,
      activeFilter.name,
      activeFilter.value
    );
    resetSelectIndex(inactiveFilter);
  }

  if (orderSelect.value) {
    filteredData = sortData(filteredData, "name", orderSelect.value);
  }

  rootElement.innerHTML = "";
  rootElement.appendChild(Cards(filteredData));
}

function handleOrder(data, orderSelect) {
  let orderedData = data;
  orderedData = sortData(orderedData, "name", orderSelect.value);
  rootElement.innerHTML = "";
  rootElement.appendChild(Cards(orderedData));
}

document.addEventListener("DOMContentLoaded", () => {
  const filterSelectType = document.querySelector("#type-select");
  const filterSelectApplication = document.querySelector(
    "#applicationField-select"
  );
  const orderSelect = document.querySelector("#order-select");
  const clearButton = document.querySelector('[data-testid="button-clear"]');
  const metricsButton = document.querySelector(".metrics");

  filterSelectType.addEventListener("change", () => {
    applyFilterAndSort(filterSelectType, filterSelectApplication, orderSelect);
  });

  filterSelectApplication.addEventListener("change", () => {
    applyFilterAndSort(filterSelectApplication, filterSelectType, orderSelect);
  });

  orderSelect.addEventListener("change", () => {
    if (filterSelectType.value) {
      applyFilterAndSort(
        filterSelectType,
        filterSelectApplication,
        orderSelect
      );
    } else if (filterSelectApplication.value) {
      applyFilterAndSort(
        filterSelectApplication,
        filterSelectType,
        orderSelect
      );
    } else {
      handleOrder(data, orderSelect);
    }
  });

  clearButton.addEventListener("click", () => {
    resetSelectIndex(filterSelectType, filterSelectApplication, orderSelect);
    rootElement.innerHTML = "";
    rootElement.appendChild(Cards(data));
  });

  metricsButton.addEventListener("click", (event) => {
    event.preventDefault();
    // const metricsItems = computeStats(data);
    rootElement.innerHTML = "";
    // rootElement.appendChild(renderRanking(metricsItems));

    const h3Elements = document.querySelectorAll(".title-overlay");
    h3Elements[0].innerHTML = "Lenguaje De Programación Más Usado";
    h3Elements[1].innerHTML = "Lenguaje De Programación Más Antiguo";
    h3Elements[2].innerHTML = "Lenguaje De Programación Más Actual";
  });
});

