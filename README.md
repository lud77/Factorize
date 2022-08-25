To install

    $ yarn

as ```npm install``` produces an error when trying to resolve webpack


To send a message to a socket-listener panel, use:

    $ node bin/send --topic XXXX --message YYYY

where XXXX is the name of the panel's channel and YYYY is the actual message


--- System integration

- [~] Main menu' commands
    - [x] new
    - [x] save
    - [x] save as
    - [x] open
    - [ ] import (loads file without wiping workarea)
    - etc
- [ ] Ask for confirmation before replacing current document in "new" and "open" actions
- [ ] Ask for confirmation before overriding an existing file in "save as" action
- [ ] Settings page
- [ ] Plugin system
- [ ] Add lateral scrolling to toolbar to be able to reach out-of-screen items
- [x] Main-thread service framework to avoid squashing everything into electron.js

--- Context menu

- [x] Disconnect panel -> removes all connections
- [x] Duplicate panel -> creates an clone of the panel
- [x] Find origin -> moves view to --middle of the graph-- NO: it moves you back to [0, 0]
- [x] "Delete panel" becomes "Delete panels" when used on selected panel
- [x] Group/Ungroup panels: grouped panels move together

--- Engine

- [x] Introduce Pulse-type signals
- [x] Introduce Sources panel palette
- [~] Actual panels
    - [ ] FLOW: All: (multiple Pulses -> single Pulse) waits for a pulse on each of the inputs and then gives sends a pulse through the output
    - [ ] FLOW: For: (from:Value + to:Value + step:Value + Pulse -> Pulse + Pulse + Value) expose index variable and emit "execute" every loop until "exit"
    - [/] (SAME AS IF) FLOW: While: (Value + Pulse -> Pulse + Pulse) if value is truthy, activate "execute", otherwise activate "exit"
    - [ ] Envelope visualizer (multi-input pin with value for each? Not sure)
    - [ ] ?????: (Value + Value -> Value) Date formatter according to pattern and separator
    - [ ] Stdin/Stdout/Stderr
    - [ ] IMAGE: Convolution
    - [ ] ALGEBRA: Matrix
    - [ ] Color ramp
    - [ ] Perlin noise
    - [ ] INPUTS: File info
    - [ ] Operations with Arrays/Collections? How? What about objects? They are certainly needed for api calls etc
        - [x] Basic Array panel (List)
            - [x] Add Pop, Shift, Unshift pins
        - [x] Merge
        - [x] Intersection
        - [x] Unique (Distinct)
        - [x] Basic Object panel (Dictionary)
    - [x] TRANSFORMS: Date/time to Timestamp
    - [x] TRANSFORMS: Timestamp to Date/time
    - [x] ALGEBRA: Threshold: (Value -> Value) sets outputs (High, Equal, Low) to true depending on whether first input is <=> than second
    - [x] INPUT: Toggle: (UI -> Value) set output to true or false depending on toggle
    - [x] BASIC: Counter: (Pulse -> Value) count pulses (also has a Reset pin)
    - [x] BASIC: Memory: (Pulse + Value -> Value) store content of value input when it receives a pulse
    - [x] INPUT: Button: (UI -> Pulse) send a pulse when user presses button
    - [x] FLOW: If: (Value -> Pulse) send pulse along Then or Else branches based on value of expression
    - [x] FLOW: Delta: (Value -> Pulse) send a pulse when input changes
    - [x] OUTPUT: Semaphore: (Value -> UI) turn on a led if the value is non-null, red or green depending on truthy value
    - [x] OUTPUT: Logfile: (Value + Pulse -> OS) append message to file
    - [x] INPUT: Deviator: (Value + Value -> Value) The output to 1 of N inputs based on the value of another input
    - [x] FLOW: Delay: (Pulse -> X secs -> Pulse)
    - [x] EVENTS: Clock: (every X secs -> Pulse)
    - [x] INPUT: Color Picker
    - [x] INPUT: Knob with inputs for min, max, and step
    - [x] INPUT: Range with inputs for min, max, and step
    - [x] OUTPUT: Logger: (a more complex mix of Display and LogFile that keeps N lines of text and adds a new line upon receiving a Pulse)
    - [x] OUTPUT: Led: Similar to Semaphore but with color input
    - [x] SOURCES: (Pulse -> Value) Fetch Current Date
    - [x] SOURCES: (Pulse -> Value) Fetch Current Time
    - [x] SOURCES: (Pulse -> Value) Fetch Random number between 0 and 1
    - [x] SOURCES: (Pulse -> Value) Fetch Current timestamp
    - [x] SOURCES: Text file, line by line
    - [x] FLOW: Gate (pass transistor)
    - [x] OUTPUTS: Color view
    - [x] EVENTS: Emit on file change
    - [x] EVENTS: Socket: socket listener, together with CLI tool to connect and send messages
    - [x] EVENTS: Accumulator
- [ ] Stepper-type panels or endpoints or connections, still not sure which
- [ ] Explicitly handle the "null/undefined" value in a more organic way


- [ ] Needs more orthogonality: possibility to set both inputs and outputs from execute or onPulse, etc


-- UI

- [ ] Make selected panels get closer or father away by rolling the scroller
- [ ] Right clicking on the workarea opens Panel search
- [ ] Pulling a connection from an endpoint to the workarea opens Panel search
    - [ ] Panel search is constrained by the initial endpoint being an input or output endpoint
    - [ ] Panel search is constrained by signal and type of the initial endpoint
- [ ] Setting default values for primitive endpoints inline
- [ ] Make width of collapsed panel a constant (currently the magic number 120)
- [ ] Make magic numbers become constants
- [ ] Make endpoint section in the panels collapsible
- [~] Move all visual state from panels to panelCoords
    - [x] width and height, minWidth and minHeight
    - [x] resizer
- [x] Double clicking on title of panel to collapse a panel completely
- [x] Make Connector component require coordinates rather than elements, so that the logic can be made more flexible
- [x] Expose signal of endpoint throught color
- [x] Introduce white halo around focused panel
- [x] Lock children (and/or Lock parents?) of a panel OR lock selected panels so they always move together
- [x] Unlock a panel that had been locked with others
- [x] Expose type of endpoint throught symbols/letters
- [x] Expose type of endpoint in tooltip
- [x] Make background of text input panel darker


--- State management

- [ ] State management seems to be the main bottleneck, general simplification of the state management seems to be necessary
- [x] Maintain and use endpoint offsets relative to panel position (only rely on screen state when updating the offsets)


--- Bugs / Performance

- [ ] Disallow Value-type signals from creating feedback loops
- [ ] Sanitize topic input to listener
- [ ] Stalls when trying to rewind file source from EOF signal without a delay

- [x] Window resize causes slowdown and stalling --- PROBABLY FIXED
- [x] Only render panels in view
- [x] Consider ways of reducing number of connections shown (bounding box overlapping view?)
- [x] Connectors losing contact with panels
- [x] Stopping clock connected to dice makes dice output go undefined
- [x] Deletion of panels must affect also panelCoords
- [x] Save-files should include position of viewport
- [x] Crash when deleting multiple panels
- [x] Crash when I pause with the Controls button
- [x] WatchFile panel should remove and replace watcher behind the scenes when file name changes, just like the Listener panel does


--- QA

- [ ] Add tests


--- NOTES

- If possible decouple UI panels from Pulse-activated panels

- When having a UI panel that also has Pulse-type inputs pins, the two avenues of activation may end up overwriting each other's outputs causing bugs



--- NAMES

stress on purpose (automation, coding, workflow, dataflow, hacking, event-driven)

    automatic
    autonomous

    mono-
    poly-
    multi-

    blackbox

    hackomatic
    hackomation

stress on approach (custom wiring of modular elements)

    wiring
    wire
    cable
    modular
    hardcoded
    factorization
    meta
