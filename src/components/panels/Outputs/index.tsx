import DisplayLogger from './displayLogger';
import FileLogger from './fileLogger';
import StdOutLogger from './stdOutLogger';
import ConsoleLogger from './consoleLogger';
import ImageSave from './imageSave';
import TextView from './textView';
import ImageView from './imageView';
// import AudioOut from './audioOut';
import ColorView from './colorView';
import FunctionPlotter from './functionPlotter';
import Semaphore from './semaphore';
import Led from './led';

const panels = {
    DisplayLogger,
    StdOutLogger,
    FileLogger,
    ConsoleLogger,
    ImageSave,
    TextView,
    // AudioOut,
    ImageView,
    ColorView,
    FunctionPlotter,
    Semaphore,
    Led
};

export default panels;