import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import SubredditSearchForm from "~/forms/SubredditSearchForm";
import { trackUiEvent } from "~/utils/mixpanelClient";
import { MixpanelEvents } from "~/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/pro-solid-svg-icons";
import { Button } from "../ui/button";

const SearchModal = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          size="sm"
          className="mx-3"
          onClick={() => {
            trackUiEvent(MixpanelEvents.OPEN_SEARCH_DRAWER);
          }}
        >
          <FontAwesomeIcon icon={faSearch} className="mr-4 text-xs" />
          <p className="text-sm">Search</p>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Search Reddit</SheetTitle>
        </SheetHeader>
        <SubredditSearchForm />
      </SheetContent>
    </Sheet>
  );
};

export default SearchModal;
