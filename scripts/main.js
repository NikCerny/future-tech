import Header from "./Header.js";
import TabsCollection from "./Tabs.js";
import VideoPlayerCollection from "./VideoPlayer.js";
import ExpandableContentCollection from "./ExpandableContent.js";
import AnchorNavigationCollection from "./AnchorNavigation.js";

new Header();
new TabsCollection();
new VideoPlayerCollection();
const expandableContentCollection = new ExpandableContentCollection();

new AnchorNavigationCollection(expandableContentCollection);
