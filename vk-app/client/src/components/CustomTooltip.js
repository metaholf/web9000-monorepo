import { Icon20QuestionOutline } from "@vkontakte/icons";
import { ActionSheet, ActionSheetItem, Button, SplitLayout } from "@vkontakte/vkui"
import { useRef, useState } from "react";

export const CustomTooltip = ({ text }) => {
  const [popout, setPopout] = useState(null);
  const baseTargetRef = useRef();
  const onClose = () => setPopout(null);
  const openBase = () => setPopout(
    <ActionSheet
      onClose={onClose}
      toggleRef={baseTargetRef}
      iosCloseItem={<Icon20QuestionOutline />}
    >
      <ActionSheetItem style={{ pointerEvents: 'none', }} autoClose>
        <p style={{ whiteSpace: 'pre-line' }}>
          {text}
        </p>
      </ActionSheetItem>
    </ActionSheet>
  )
  return (
    <SplitLayout popout={popout}>
      <Button getRootRef={baseTargetRef} onClick={openBase}>
        <Icon20QuestionOutline />
      </Button>
    </SplitLayout>
  )
}