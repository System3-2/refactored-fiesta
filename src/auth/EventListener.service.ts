import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { eventTypes } from "src/utils";

export class EventListener {

  @OnEvent(eventTypes.name)
  handleEvent(payload: any) {
    console.log(payload)
    return payload
  }
}
