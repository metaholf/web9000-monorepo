import { Icon24Cancel } from "@vkontakte/icons";
import { Button, Div, Group, PopoutWrapper, Title } from "@vkontakte/vkui";

export const Modal = ({ onClose, title, children, minWidth = '600px' }) => {
  return (
    <PopoutWrapper onClick={onClose}>
      <Group style={{ minWidth, padding: '40px' }}>
        <Div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title>{title}</Title>
          <Button onClick={onClose}>
            <Icon24Cancel />
          </Button>
        </Div>
        <Div style={{ padding: '10px' }}>
          {children}
        </Div>
      </Group>
    </PopoutWrapper>
  );
};
