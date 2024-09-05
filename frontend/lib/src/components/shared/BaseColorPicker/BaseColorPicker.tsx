/**
 * Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022-2024)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react"

import { StatefulPopover as UIPopover } from "baseui/popover"
import { ChromePicker, ColorResult } from "react-color"

import {
  StyledWidgetLabelHelpInline,
  WidgetLabel,
} from "@streamlit/lib/src/components/widgets/BaseWidget"
import TooltipIcon from "@streamlit/lib/src/components/shared/TooltipIcon"
import { Placement } from "@streamlit/lib/src/components/shared/Tooltip"
import { LabelVisibilityOptions } from "@streamlit/lib/src/util/utils"
import { logWarning } from "@streamlit/utils"

import {
  StyledChromePicker,
  StyledColorBlock,
  StyledColorPicker,
  StyledColorPreview,
  StyledColorValue,
} from "./styled-components"

export interface BaseColorPickerProps {
  disabled: boolean
  width?: number
  value: string
  showValue?: boolean
  label: string
  labelVisibility?: LabelVisibilityOptions
  onChange: (value: string) => any
  help?: string
}

interface State {
  /**
   * The value specified by the user via the UI. If the user didn't touch this
   * widget's UI, the default value is used.
   */
  value: string
}

class BaseColorPicker extends React.PureComponent<
  BaseColorPickerProps,
  State
> {
  public state: State = {
    value: this.props.value,
  }

  public componentDidUpdate(prevProps: BaseColorPickerProps): void {
    if (
      prevProps.value !== this.props.value &&
      this.props.value !== this.state.value
    ) {
      this.setState((_, prevProps) => {
        return { value: prevProps.value }
      })
    }
  }

  // Note: This is a "local" onChange handler used to update the color preview
  // (allowing the user to click and drag). this.props.onChange is only called
  // when the ColorPicker popover is closed.
  private onColorChange = (color: ColorResult): void => {
    this.setState({ value: color.hex })
  }

  private onColorClose = (): void => {
    this.props.onChange(this.state.value)
  }

  // eslint-disable-next-line class-methods-use-this
  public componentDidCatch(error: Error): void {
    if (error?.name === "SecurityError") {
      // 2021.06.30 - on Streamlit Sharing, ColorPicker throws a cross-origin
      // error when its popover window is closed. There's an issue open in the
      // react-color repo https://github.com/casesandberg/react-color/issues/806 -
      // but it's months old and hasn't had a developer response.
      logWarning(
        `Swallowing ColorPicker SecurityError '${error.name}: ${error.message}'`
      )

      // We force an update after this error, to re-mount the UIPopover -
      // because the error sometimes cause it to be unmounted. This is an
      // unfortunate hack.
      this.forceUpdate()
    } else {
      throw error
    }
  }

  public render(): React.ReactNode {
    const { width, showValue, label, labelVisibility, help, disabled } =
      this.props
    const { value } = this.state

    return (
      <StyledColorPicker
        className="stColorPicker"
        data-testid="stColorPicker"
        width={width}
        disabled={disabled}
      >
        <WidgetLabel
          label={label}
          disabled={disabled}
          labelVisibility={labelVisibility}
        >
          {help && (
            <StyledWidgetLabelHelpInline>
              <TooltipIcon content={help} placement={Placement.TOP_RIGHT} />
            </StyledWidgetLabelHelpInline>
          )}
        </WidgetLabel>
        <UIPopover
          onClose={this.onColorClose}
          content={() => (
            <StyledChromePicker data-testid="stColorPickerPopover">
              <ChromePicker
                color={value}
                onChange={this.onColorChange}
                disableAlpha={true}
              />
            </StyledChromePicker>
          )}
        >
          <StyledColorPreview disabled={disabled}>
            <StyledColorBlock
              data-testid="stColorPickerBlock"
              backgroundColor={value}
              disabled={disabled}
            />
            {showValue && (
              <StyledColorValue>{value.toUpperCase()}</StyledColorValue>
            )}
          </StyledColorPreview>
        </UIPopover>
      </StyledColorPicker>
    )
  }
}

export default BaseColorPicker
