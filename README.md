To install

    $ yarn

as ```npm install``` produces an error when trying to resolve webpack


--- System integration

- [ ] Main menu' commands
    - [ ] save
    - [ ] load
    - etc
- [ ] Settings page
- [ ] Plugin system
- [ ] Main-thread service framework to avoid squashing everything into electron.js

--- Engine

- [ ] Introduce Pulse-type signals
- [ ] Actual panels
    - [ ] If: (Value -> Pulse) send pulse along Then or Else branches based on value of expression
    - [ ] Delta: (Value -> Pulse) send a pulse when input changes
    - [ ] Counter: (Pulse -> Value) count pulses (also has a Reset pin)
    - [ ] Memory: (Pulse + Value -> Value) store content of value input when it receives a pulse
    - [ ] Button: (UI -> Pulse) send a pulse when user presses button
    - [ ] Deviator: (UI + Value -> Value) set 1 of 2 outputs to the input value depending on status of UI switch
    - [ ] Delay: (Pulse -> X secs -> Pulse)
    - [ ] Clock: (every X secs -> Pulse)
    - [ ] Threshold: (Value + Value -> Value + Value + Value) sets outputs (High, Equal, Low) to true depending on whether first input is <=> than second
    - [ ] Wait: (multiple Pulses -> single Pulse) waits for a pulse on each of the inputs and then gives sends a pulse through the output
- [ ] Groupings
- [ ] Stepper-type panels or endpoints or connections, still not sure which

--- Bugs / Performance

- [x] Window resize causes slowdown and stalling --- PROBABLY FIXED
- [x] Connectors losing contact with panels
- [ ] Only render panels in view
- [ ] Disallow Value-type signals from create feedback loops

--- QA

- [ ] Add tests