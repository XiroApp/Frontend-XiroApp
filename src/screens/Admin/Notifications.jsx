import { Button, Switch } from "@mui/material";
import React, { useState } from "react";
import { updateUser } from "../../redux/actions";
import { useDispatch } from "react-redux";

export default function Notifications({ user }) {
  const dispatch = useDispatch();

  const [notifications, setNotifications] = useState({
    allowNotifications: true, // user.mailNotifications && user.whatsappNotifications,
    mailNotifications: user.notifications.mail ,
    whatsappNotifications: user.notifications.whatsapp ,
  });
  function hanldeAllowNotifications(e) {
    e.preventDefault();

    if (!e.target.checked) {
      setNotifications({
        allowNotifications: false,
        mailNotifications: false,
        whatsappNotifications: false,
      });
    } else {
      setNotifications({
        ...notifications,
        allowNotifications: true,
      });
    }
  }
  function handleMailNotifications(e) {
    setNotifications({
      ...notifications,
      mailNotifications: e.target.checked,
    });
  }
  function handleWhatsappNotifications(e) {
    setNotifications({
      ...notifications,
      whatsappNotifications: e.target.checked,
    });
  }

  async function handleSaveChanges(e) {
    e.preventDefault();

    dispatch(
      updateUser({
        ...user,
        notifications: {
          whatsapp: notifications.whatsappNotifications,
          mail: notifications.mailNotifications,
        },
      })
    );
  }



  return (
    <div className="flex flex-col rounded-2xl lg:h-2/3 p-1 gap-5">
    
      <section className="flex justify-between items-center rounded-2xl p-5 bg-[#1e1e1e]">
        <div className="flex flex-col">
          <span className="text-xl">Mail</span>
        </div>
        <Switch
          onChange={(e) => handleMailNotifications(e)}
          size=""
          checked={notifications.mailNotifications}
          disabled={!notifications.allowNotifications}
        />
      </section>
      <section className="flex justify-between items-center rounded-2xl p-5 bg-[#1e1e1e]">
        <div className="flex flex-col">
          <span className="text-xl">Whatsapp</span>
        </div>
        <Switch
          onChange={(e) => handleWhatsappNotifications(e)}
          size=""
          checked={notifications.whatsappNotifications}
          disabled={!notifications.allowNotifications}
        />
      </section>
      <section className="flex justify-end p-5">
        <Button
          onClick={(e) => handleSaveChanges(e)}
          className="w-full lg:w-32"
          variant="contained"
          color="primary"
        >
          Guardar
        </Button>
      </section>
    </div>
  );
}
