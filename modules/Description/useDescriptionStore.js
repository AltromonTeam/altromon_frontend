import { create } from "zustand";
import { toast } from "react-toastify";
import ServersDataService from "@/services/ServersDataService";

const useProfileStore = create((set, get) => ({
  description: {
    "Hitech_1.12.2_forge": {
      about: "Инфа про Хайтек",
      mods: "Есть",
      changeLog: [],
    },
    "Survival_1.20.1_vanila": {
      about: "Инфа про Ванила",
      mods: "Нэт",
      changeLog: [],
    },
  },
  setAbout: (server, data) => {
    set({
      description: {
        ...get().description,
        [server]: { ...get().description[server], about: data },
      },
    });
  },
  setMods: (server, data) => {
    set({
      description: {
        ...get().description,
        [server]: { ...get().description[server], mods: data },
      },
    });
  },
  setDate: (server, data, lineId) => {
    const changeLog = get().description[server].changeLog;
    changeLog[lineId].date = data;
    set({
      description: {
        ...get().description,
        [server]: { ...get().description[server], changeLog },
      },
    });
  },
  setType: (server, data, lineId, actionId) => {
    const changeLog = get().description[server].changeLog;
    changeLog[lineId].actions[actionId].type = data;
    set({
      description: {
        ...get().description,
        [server]: { ...get().description[server], changeLog },
      },
    });
  },
  setContent: (server, data, lineId, actionId) => {
    const changeLog = get().description[server].changeLog;
    changeLog[lineId].actions[actionId].content = data;
    set({
      description: {
        ...get().description,
        [server]: { ...get().description[server], changeLog },
      },
    });
  },
  setContentAbout: (server, data, lineId, actionId) => {
    const changeLog = get().description[server].changeLog;
    changeLog[lineId].actions[actionId].about = data;
    set({
      description: {
        ...get().description,
        [server]: { ...get().description[server], changeLog },
      },
    });
  },
  deleteDay: (server, lineId) => {
    set({
      description: {
        ...get().description,
        [server]: {
          ...get().description[server],
          changeLog: get().description[server].changeLog.filter(
            (item, itemId) => itemId !== lineId,
          ),
        },
      },
    });
  },
  deleteLineDay: (server, lineId, actionId) => {
    const changeLog = get().description[server].changeLog;
    changeLog[lineId].actions.splice(actionId, 1);
    if (changeLog[lineId].actions.length === 0) {
      changeLog.splice(lineId, 1);
    }
    set({
      description: {
        ...get().description,
        [server]: {
          ...get().description[server],
          changeLog,
        },
      },
    });
  },
  addLog(server, date, type, content, about) {
    if (!date || !type || !content) {
      toast("Заполнены не все обязательные поля", {
        render: "Заполнены не все обязательные поля",
        type: "error",
        autoClose: 3000,
      });
      return true;
    }
    const changeLog = get().description[server].changeLog;
    changeLog.unshift({
      date,
      actions: [
        {
          type,
          content,
          about,
        },
      ],
    });
    set({
      addDate: "",
      addType: "",
      addContent: "",
      addContentAbout: "",
      description: {
        ...get().description,
        [server]: {
          ...get().description[server],
          changeLog: changeLog,
        },
      },
    });
  },
  addLineLog(server, logId, type, content, about) {
    if (!type || !content) {
      return toast("Заполнены не все обязательные поля", {
        render: "Заполнены не все обязательные поля",
        type: "error",
        autoClose: 3000,
      });
    }
    const changeLog = get().description[server].changeLog;
    changeLog[logId].actions.push({
      type,
      content,
      about,
    });
    set({
      description: {
        ...get().description,
        [server]: {
          ...get().description[server],
          changeLog: changeLog,
        },
      },
    });
  },
  save: async () => {
    const toastId = toast.loading("Сохраняем...");
    try {
      await ServersDataService.write(get().description);
      toast.update(toastId, {
        render: "Сохранено",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (e) {
      toast.update(toastId, {
        render: e.response.data.message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  },
  get: async () => {
    const toastId = toast.loading("Получаем данные...");
    try {
      const res = await ServersDataService.read();
      set({ description: res.data });
      toast.update(toastId, {
        render: "Получено",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (e) {
      toast.update(toastId, {
        render: e.response.data.message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  },
}));

export default useProfileStore;
