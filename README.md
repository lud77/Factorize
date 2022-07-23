To install

    $ yarn

as ```npm install``` produces an error when trying to resolve webpack


--- System integration

- [ ] Main menu' commands
    - [x] new
    - [x] save
    - [x] save as
    - [x] open
    - etc
- [ ] Settings page
- [ ] Plugin system
- [ ] Main-thread service framework to avoid squashing everything into electron.js
- [ ] Add lateral scrolling to toolbar to be able to reach out-of-screen items

--- Context menu

- [ ] Disconnect panel -> removes all connections
- [ ] Duplicate panel -> creates an clone of the panel

--- Engine

- [ ] Introduce Pulse-type signals
- [ ] Actual panels
    - [x] FUNCTIONS: Threshold: (Value -> Value) sets outputs (High, Equal, Low) to true depending on whether first input is <=> than second
    - [x] INPUT: Toggle: (UI -> Value) set output to true or false depending on toggle
    - [x] BASIC: Counter: (Pulse -> Value) count pulses (also has a Reset pin)
    - [x] BASIC: Memory: (Pulse + Value -> Value) store content of value input when it receives a pulse
    - [x] INPUT: Button: (UI -> Pulse) send a pulse when user presses button
    - [x] FLOW: If: (Value -> Pulse) send pulse along Then or Else branches based on value of expression
    - [x] FLOW: Delta: (Value -> Pulse) send a pulse when input changes
    - [x] OUTPUT: Led: (Value -> UI) turn on a led if the value is non-zero
    - [ ] OUTPUT: Logfile: (Value + Pulse -> OS) append message to file
    - [ ] INPUT: Deviator: (UI + Value -> Value) set 1 of 2 outputs to the input value depending on status of UI switch
    - [ ] FLOW: Delay: (Pulse -> X secs -> Pulse)
    - [ ] EVENTS: Clock: (every X secs -> Pulse)
    - [ ] FLOW: Wait: (multiple Pulses -> single Pulse) waits for a pulse on each of the inputs and then gives sends a pulse through the output
- [ ] Groupings
- [ ] Stepper-type panels or endpoints or connections, still not sure which

--- Bugs / Performance

- [x] Window resize causes slowdown and stalling --- PROBABLY FIXED
- [x] Connectors losing contact with panels
- [ ] Only render panels in view
- [ ] Disallow Value-type signals from create feedback loops

--- QA

- [ ] Add tests