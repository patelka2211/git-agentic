import branch from "./branch";
import remote from "./remote";
import stash from "./stash";
import workspace from "./workspace";

export default [...branch, ...stash, ...workspace, ...remote];
