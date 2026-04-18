lucide.createIcons();

const events = [
  {
    name: "Meteor Rush",
    idleStatus: "Queued",
    idleClass: "queued",
    countdownText: "Meteor fragments inbound. Arena unlocks in",
    activeText: "Meteor Rush is live. Loot is dropping across spawn."
  },
  {
    name: "Treasure Rain",
    idleStatus: "Idle",
    idleClass: "idle",
    countdownText: "Treasure Rain begins soon. Crates are loading in",
    activeText: "Treasure Rain is live. Collect crates before they vanish."
  },
  {
    name: "King of Hill",
    idleStatus: "Idle",
    idleClass: "idle",
    countdownText: "Hill capture opens shortly. Claim timer starts in",
    activeText: "King of Hill is live. Hold the point to score."
  },
  {
    name: "PvP Frenzy",
    idleStatus: "Cooldown",
    idleClass: "cooldown",
    countdownText: "PvP Frenzy unlocks after cooldown. Arena opens in",
    activeText: "PvP Frenzy is live. Final survivor gets the reward."
  }
];

const state = {
  selectedIndex: 0,
  running: false,
  countdown: 10,
  timerId: null
};

const eventName = document.getElementById("event-name");
const eventMessage = document.getElementById("event-message");
const countdownValue = document.getElementById("countdown-value");
const eventPhase = document.getElementById("event-phase");
const bossbarTitle = document.getElementById("bossbar-title");
const bossbarProgressText = document.getElementById("bossbar-progress-text");
const bossbarFill = document.getElementById("bossbar-fill");
const selectedEvent = document.getElementById("selected-event");
const statusMode = document.getElementById("status-mode");
const bossbarMode = document.getElementById("bossbar-mode");
const pluginStatus = document.getElementById("plugin-status");
const panelCurrentEvent = document.getElementById("panel-current-event");
const schedulerState = document.getElementById("scheduler-state");
const startButton = document.getElementById("start-event");
const stopButton = document.getElementById("stop-event");
const panelStartButton = document.getElementById("panel-start");
const panelStopButton = document.getElementById("panel-stop");
const cycleButton = document.getElementById("cycle-event");
const eventItems = Array.from(document.querySelectorAll(".event-item"));

function getSelectedEvent() {
  return events[state.selectedIndex];
}

function updateEventButtons(activeName, activeState, activeClass) {
  eventItems.forEach((item) => {
    const badge = item.querySelector(".event-state");
    const isSelected = item.dataset.event === activeName;

    item.classList.toggle("active", isSelected);

    if (!badge) {
      return;
    }

    const eventData = events.find((entry) => entry.name === item.dataset.event);
    const label = isSelected ? activeState : eventData.idleStatus;
    const className = isSelected ? activeClass : eventData.idleClass;

    badge.textContent = label;
    badge.className = `event-state ${className}`;
  });
}

function setPhase(name, label) {
  eventPhase.textContent = label;
  eventPhase.className = `phase ${name}`;
}

function setBossbar(percent, text) {
  const safePercent = Math.max(0, Math.min(100, percent));
  bossbarFill.style.width = `${safePercent}%`;
  bossbarProgressText.textContent = `${Math.round(safePercent)}%`;
  bossbarTitle.textContent = text;
}

function syncIdleView() {
  const current = getSelectedEvent();
  eventName.textContent = current.name;
  eventMessage.textContent = "Click start event to trigger a fake pre-start countdown and bossbar preview.";
  countdownValue.textContent = "--";
  setPhase("standby", "Standby");
  setBossbar(0, "BossBar Preview");
  selectedEvent.textContent = current.name;
  statusMode.textContent = "Idle";
  bossbarMode.textContent = "Hidden";
  pluginStatus.textContent = "Ready";
  panelCurrentEvent.textContent = current.name;
  schedulerState.textContent = "Waiting for input";
  updateEventButtons(current.name, current.idleStatus, current.idleClass);
}

function stopSimulation(mode = "Stopped") {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }

  state.running = false;

  if (mode === "Stopped") {
    const current = getSelectedEvent();
    eventMessage.textContent = `${current.name} was stopped in the fake UI. Use start to run the preview again.`;
    countdownValue.textContent = "00";
    setPhase("stopped", "Stopped");
    setBossbar(0, "BossBar Hidden");
    statusMode.textContent = "Stopped";
    bossbarMode.textContent = "Hidden";
    pluginStatus.textContent = "Stopped by admin";
    schedulerState.textContent = "Manual stop issued";
    updateEventButtons(current.name, "Stopped", "cooldown");
    return;
  }

  syncIdleView();
}

function startSimulation() {
  if (state.running) {
    return;
  }

  const current = getSelectedEvent();
  state.running = true;
  state.countdown = 10;
  selectedEvent.textContent = current.name;
  panelCurrentEvent.textContent = current.name;
  statusMode.textContent = "Countdown";
  bossbarMode.textContent = "Visible";
  pluginStatus.textContent = "Preparing event";
  schedulerState.textContent = "Pre-start countdown running";
  setPhase("countdown", "Countdown");
  updateEventButtons(current.name, "Starting", "queued");

  const renderStep = () => {
    const progress = ((10 - state.countdown) / 10) * 100;
    eventName.textContent = current.name;
    eventMessage.textContent = `${current.countdownText} ${state.countdown}s`;
    countdownValue.textContent = String(state.countdown).padStart(2, "0");
    setBossbar(progress, `${current.name} starts in ${state.countdown}s`);

    if (state.countdown === 0) {
      clearInterval(state.timerId);
      state.timerId = null;
      setPhase("active", "Active");
      countdownValue.textContent = "GO";
      eventMessage.textContent = current.activeText;
      statusMode.textContent = "Live";
      bossbarMode.textContent = "Tracking players";
      pluginStatus.textContent = "Event running";
      schedulerState.textContent = "Broadcasting live event state";
      setBossbar(100, `${current.name} live now`);
      updateEventButtons(current.name, "Active", "active");
      state.running = false;
      return;
    }

    state.countdown -= 1;
  };

  renderStep();
  state.timerId = window.setInterval(renderStep, 1000);
}

function selectEventByName(name) {
  const index = events.findIndex((entry) => entry.name === name);

  if (index === -1) {
    return;
  }

  const wasRunning = state.running || Boolean(state.timerId);
  if (wasRunning) {
    stopSimulation("Reset");
  }

  state.selectedIndex = index;
  syncIdleView();
}

eventItems.forEach((item) => {
  item.addEventListener("click", () => {
    selectEventByName(item.dataset.event);
  });
});

cycleButton.addEventListener("click", () => {
  const nextIndex = (state.selectedIndex + 1) % events.length;
  selectEventByName(events[nextIndex].name);
});

startButton.addEventListener("click", startSimulation);
panelStartButton.addEventListener("click", startSimulation);
stopButton.addEventListener("click", () => stopSimulation("Stopped"));
panelStopButton.addEventListener("click", () => stopSimulation("Stopped"));

syncIdleView();
