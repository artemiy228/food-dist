window.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tabheader__item"),
    tabsContent = document.querySelectorAll(".tabcontent"),
    tabsParent = document.querySelector(".tabheader__items");

  function hideTabContent() {
    tabsContent.forEach((item) => {
      item.style.display = "none";
    });

    tabs.forEach((item) => {
      item.classList.remove("tabheader__item_active");
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].style.display = "block";
    tabs[i].classList.add("tabheader__item_active");
  }

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener("click", (event) => {
    const target = event.target;
    if (target && target.classList.contains("tabheader__item")) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  // Clock
  const deadLine = "2020-09-03";

  function getTimeRemining(endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date()),
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
      hours = Math.floor((t / (1000 * 60 * 60)) % 24),
      minutes = Math.floor((t / 1000 / 60) % 60),
      seconds = Math.floor((t / 1000) % 60);

    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    }
    return num;
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector("#days"),
      hours = timer.querySelector("#hours"),
      minutes = timer.querySelector("#minutes"),
      seconds = timer.querySelector("#seconds"),
      timeInterval = setInterval(updateClock, 1000);
    updateClock();

    function updateClock() {
      const t = getTimeRemining(endtime);

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }
  setClock(".timer", deadLine);

  // Modal

  const modalTrigger = document.querySelectorAll("[data-modal]"),
    modal = document.querySelector(".modal"),
    modalCloser = document.querySelector("[data-close]");

  function openModal() {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    clearTimeout(modalTimerId); // Если пользователь сам открыл окно до его автоматического открытия
  }

  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }

  const modalTimerId = setTimeout(openModal, 10000); // 10sec

  modalTrigger.forEach((btn) => {
    btn.addEventListener("click", () => {
      openModal();
    });
  });

  modalCloser.addEventListener("click", (event) => {
    closeModal();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.code === "Escape") {
      closeModal();
    }
  });

  function showModalByScroll() {
    const docElem = document.documentElement;
    if (window.pageYOffset + docElem.clientHeight >= docElem.scrollHeight) {
      openModal();
      window.removeEventListener("scroll", showModalByScroll);
    }
  }
  window.addEventListener("scroll", showModalByScroll);

  // Menu food

  class MenuCard {
    constructor(
      src,
      alt,
      title,
      description,
      price,
      parentSelector,
      ...classes
    ) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.description = description;
      this.price = price;
      this.transfer = 27;
      this.parent = document.querySelector(parentSelector);
      this.classes = classes;
      this.changeToUAH();
    }

    changeToUAH() {
      this.price = this.price * this.transfer;
    }
    render() {
      const element = document.createElement("div");
      if (this.classes.length === 0) {
        this.element = "menu__item";
      } else {
        this.classes.forEach((className) => {
          element.classList.add(className);
        });
      }
      element.innerHTML = `
		<img src=${this.src} alt=${this.alt}>
			<h3 class="menu__item-subtitle">${this.title}"</h3>
			<div class="menu__item-descr">${this.title} - ${this.description}</div>
			<div class="menu__item-divider"></div>
			<div class="menu__item-price">
					<div class="menu__item-cost">Цена:</div>
					<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
			</div>
		`;
      this.parent.append(element);
    }
  }

  new MenuCard(
    "img/tabs/vegy.jpg",
    "vegy",
    "Меню 'Фитнес'",
    "это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!",
    9,
    ".menu .container",
    "menu__item"
  ).render();


  // Forms

  const message = {
    loading: 'Loading...',
    success: 'Success!',
    failed: 'Error. Try later'
  }
  const forms = document.querySelectorAll('form');

  forms.forEach(item => {
    postData(item);
  })

  function postData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const statusMessage = document.createElement('div')
      statusMessage.textContent = message.loading
      statusMessage.append(form);
      const request = new XMLHttpRequest();
      request.open('POST', 'server.php');
      request.setRequestHeader('Content-type', 'multipart/form-data');
      const formData = new FormData(form);
      request.send(formData);
      request.addEventListener('load', (e) => {
        if (request.status === 200) {
          statusMessage.textContent = message.success;
        } else {
          statusMessage.textContent = message.failed;
          console.log('Error in post');
        }
      })
    })
  }
});