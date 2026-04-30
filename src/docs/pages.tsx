// Components
import { accordion } from "./pages/accordion";
import { accountButton } from "./pages/accountButton";
import { app } from "./pages/app";
import { badge } from "./pages/badge";
import { button } from "./pages/button";
import { callout } from "./pages/callout";
import { card } from "./pages/card";
import { chat } from "./pages/chat";
import { checkbox } from "./pages/checkbox";
import { code } from "./pages/code";
import { codeEditor } from "./pages/codeEditor";
import { complexConfigurationButton } from "./pages/complexConfigurationButton";
import { copyButton } from "./pages/copyButton";
import { datePicker } from "./pages/datePicker";
import { drawer } from "./pages/drawer";
import { errorBoundary } from "./pages/errorBoundary";
import { flex } from "./pages/flex";
import { formGroup } from "./pages/formGroup";
import { grid } from "./pages/grid";
import { horizontalRule } from "./pages/horizontalRule";
import { icon } from "./pages/icon";
import { image } from "./pages/image";
import { infoList } from "./pages/infoList";
import { infoMenu } from "./pages/infoMenu";
import { infoTable } from "./pages/infoTable";
import { kvTable } from "./pages/kvTable";
import { inProgress } from "./pages/inProgress";
import { input } from "./pages/input";
import { itemsInput } from "./pages/itemsInput";
import { label } from "./pages/label";
import { link } from "./pages/link";
import { list } from "./pages/list";
import { menu } from "./pages/menu";
import { modal } from "./pages/modal";
import { notifications } from "./pages/notifications";
import { optionsButton } from "./pages/optionsButton";
import { optionsList } from "./pages/optionsList";
import { pagination } from "./pages/pagination";
import { panel } from "./pages/panel";
import { popover } from "./pages/popover";
import { progressBar } from "./pages/progressBar";
import { prompt } from "./pages/prompt";
import { radioButton } from "./pages/radioButton";
import { searchInput } from "./pages/searchInput";
import { searchResult } from "./pages/searchResult";
import { searchSelect } from "./pages/searchSelect";
import { select } from "./pages/select";
import { setting } from "./pages/setting";
import { spacer } from "./pages/spacer";
import { spinner } from "./pages/spinner";
import { stat } from "./pages/stat";
import { status } from "./pages/status";
import { statList } from "./pages/statList";
import { steps } from "./pages/steps";
import { stepsVertical } from "./pages/stepsVertical";
import { summary } from "./pages/summary";
import { skeleton } from "./pages/skeleton";
import { superCheckboxGroup } from "./pages/superCheckboxGroup";
import { superRadioGroup } from "./pages/superRadioGroup";
import { spans } from "./pages/spans";
import { table } from "./pages/table";
import { tabs } from "./pages/tabs";
import { text } from "./pages/text";
import { textArea } from "./pages/textArea";
import { theme } from "./pages/theme";
import { portalContainer } from "./pages/portalContainer";
import { timeline } from "./pages/timeline";
import { toggle } from "./pages/toggle";
import { tooltip } from "./pages/tooltip";
import { topicButton } from "./pages/topicButton";
import { validation } from "./pages/validation";

// Utils
import { truncate } from "./pages/truncate";

type Category = { name: string; pages: Page[] };
export type Page = { name: string; path: string; examples?: Array<Example & { name: string }>; example?: Example };
type Example = { component: React.ReactNode; source: string };

export const categories: Category[] = [
  {
    name: "Query",
    pages: [chat, prompt, searchInput, searchResult, summary]
  },
  {
    name: "Application",
    pages: [app, drawer, modal, portalContainer, notifications, accountButton, theme]
  },
  {
    name: "Info",
    pages: [table, spans, infoTable, kvTable, infoList, statList, list, pagination]
  },
  {
    name: "Layout",
    pages: [
      tabs,
      timeline,
      accordion,
      stepsVertical,
      steps,
      popover,
      infoMenu,
      flex,
      grid,
      spacer,
      card,
      panel,
      horizontalRule
    ]
  },
  {
    name: "Content",
    pages: [badge, status, callout, code, icon, image, inProgress, spinner, skeleton, stat, progressBar, text, tooltip]
  },
  {
    name: "Form",
    pages: [
      validation,
      formGroup,
      setting,
      input,
      datePicker,
      label,
      select,
      toggle,
      textArea,
      codeEditor,
      checkbox,
      radioButton,
      superCheckboxGroup,
      superRadioGroup,
      itemsInput
    ]
  },
  {
    name: "Controls",
    pages: [
      button,
      complexConfigurationButton,
      copyButton,
      link,
      topicButton,
      menu,
      optionsButton,
      optionsList,
      searchSelect
    ]
  },
  {
    name: "Utils",
    pages: [errorBoundary, truncate]
  }
];

type Paths = {
  list: Page[];
  map: Record<string, Page>;
};

export const paths: Paths = categories.reduce(
  (acc, curr) => {
    // Create a list of all pages in order.
    const list = acc.list.concat(curr.pages);

    const mappedPaths = curr.pages.reduce(
      (obj, { path, name, example, examples }) => ({ ...obj, [path]: { name, example, examples } }),
      {}
    );

    // Create a map of all pages by path.
    const map = { ...acc.map, ...mappedPaths };

    return { list, map };
  },
  {
    list: [],
    map: {}
  } as Paths
);
