"use client";
import type { FC } from "react";
import React, { Fragment, useEffect, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import classNames from "@/utils/classnames";
import { Select as RSelect } from "@radix-ui/themes";
const defaultItems = [
  { value: 1, name: "option1" },
  { value: 2, name: "option2" },
  { value: 3, name: "option3" },
  { value: 4, name: "option4" },
  { value: 5, name: "option5" },
  { value: 6, name: "option6" },
  { value: 7, name: "option7" },
];

export type Item = {
  value: number | string;
  name: string;
} & Record<string, any>;

export type ISelectProps = {
  className?: string;
  wrapperClassName?: string;
  renderTrigger?: (value: Item | null) => JSX.Element | null;
  items?: Item[];
  defaultValue?: string;
  disabled?: boolean;
  onSelect?: (value: Item) => void;
  allowSearch?: boolean;
  bgClassName?: string;
  placeholder?: string;
  overlayClassName?: string;
  optionWrapClassName?: string;
  optionClassName?: string;
  hideChecked?: boolean;
  notClearable?: boolean;
  renderOption?: ({
    item,
    selected,
  }: {
    item: Item;
    selected: boolean;
  }) => React.ReactNode;
};
const Select: FC<ISelectProps> = ({
  className,
  items = defaultItems,
  defaultValue = 1,
  disabled = false,
  onSelect,
  allowSearch = true,
  bgClassName = "bg-gray-100",
  overlayClassName,
  optionClassName,
  renderOption,
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  useEffect(() => {
    let defaultSelect = null;
    const existed = items.find((item: Item) => item.value === defaultValue);
    if (existed) defaultSelect = existed;

    setSelectedItem(defaultSelect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  const filteredItems: Item[] =
    query === ""
      ? items
      : items.filter((item) => {
          return item.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <RSelect.Root defaultValue={"orange"}>
      <RSelect.Trigger className={classNames("shadow-none", className)} />
      <RSelect.Content>
        <RSelect.Item value="orange">Orange</RSelect.Item>
        <RSelect.Item value="apple">Apple</RSelect.Item>
        <RSelect.Item value="grape">Grape</RSelect.Item>
        <RSelect.Item value="carrot">Carrot</RSelect.Item>
        <RSelect.Item value="potato">Potato</RSelect.Item>
      </RSelect.Content>
    </RSelect.Root>
  );
};

export default React.memo(Select);
