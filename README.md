To install

    $ yarn

as ```npm install``` produces an error when trying to resolve webpack


--- System integration

- [~] Main menu' commands
    - [x] new
    - [x] save
    - [x] save as
    - [x] open
    - etc
- [x] Main-thread service framework to avoid squashing everything into electron.js
- [ ] Settings page
- [ ] Plugin system
- [ ] Add lateral scrolling to toolbar to be able to reach out-of-screen items

--- Context menu

- [x] Disconnect panel -> removes all connections
- [x] Duplicate panel -> creates an clone of the panel
- [?] Find origin -> moves view to middle of the graph
- [ ] "Delete panel" becomes "Delete panels" when used on selected panel

--- Engine

- [x] Introduce Pulse-type signals
- [~] Actual panels
    - [x] FUNCTIONS: Threshold: (Value -> Value) sets outputs (High, Equal, Low) to true depending on whether first input is <=> than second
    - [x] INPUT: Toggle: (UI -> Value) set output to true or false depending on toggle
    - [x] BASIC: Counter: (Pulse -> Value) count pulses (also has a Reset pin)
    - [x] BASIC: Memory: (Pulse + Value -> Value) store content of value input when it receives a pulse
    - [x] INPUT: Button: (UI -> Pulse) send a pulse when user presses button
    - [x] FLOW: If: (Value -> Pulse) send pulse along Then or Else branches based on value of expression
    - [x] FLOW: Delta: (Value -> Pulse) send a pulse when input changes
    - [x] OUTPUT: Led: (Value -> UI) turn on a led if the value is non-zero
    - [x] OUTPUT: Logfile: (Value + Pulse -> OS) append message to file
    - [ ] INPUT: Deviator: (UI + Value -> Value) set 1 of 2 outputs to the input value depending on status of UI switch
    - [ ] FLOW: Delay: (Pulse -> X secs -> Pulse)
    - [ ] EVENTS: Clock: (every X secs -> Pulse)
    - [ ] FLOW: Wait: (multiple Pulses -> single Pulse) waits for a pulse on each of the inputs and then gives sends a pulse through the output
    - [ ] FLOW: For: (from:Value + to:Value + step:Value + Pulse -> Pulse + Pulse + Value) expose index variable and emit "execute" every loop until "exit"
    - [/] (SAME AS IF) FLOW: While: (Value + Pulse -> Pulse + Pulse) if value is truthy, activate "execute", otherwise activate "exit"
    - [x] INPUT: Color Picker
    - [x] INPUT: Knob with inputs for min, max, and step
    - [x] INPUT: Range with inputs for min, max, and step
    - [ ] Envelope visualizer (multi-input pin with value for each? Not sure)
    - [ ] OUTPUT: DisplayLog (a more complex mix of Display and LogFile that keeps N lines of text and adds a new line upon receiving a Pulse)
- [ ] Groupings
- [ ] Stepper-type panels or endpoints or connections, still not sure which

- [ ] Needs more orthogonality: possibility to set both inputs and outputs from execute or onPulse, etc

-- UI

- [ ] Introduce white halo around focused panel

--- Bugs / Performance

- [x] Window resize causes slowdown and stalling --- PROBABLY FIXED
- [x] Connectors losing contact with panels

- [ ] Only render panels in view
- [ ] Disallow Value-type signals from creating feedback loops
- [x] Stopping clock connected to dice makes dice output go undefined
- [x] Deletion of panels must affect also panelCoords
- [x] Save-files should include position of viewport

--- QA

- [ ] Add tests


--- NOTES

- If possible decouple UI panels from Pulse-activated panels

- When having a UI panel that also has Pulse-type inputs pins, the two avenues of activation may end up overwriting each other's outputs causing bugs