import { Icon20AddCircle } from "@vkontakte/icons"
import { CardGrid, Div, Spinner, Card, Button, Title, Spacing, SplitLayout } from "@vkontakte/vkui"
import { useState } from "react"
import { Modal } from "../components/Modal"
import { useCollectionList } from "../hooks/useCollectionList"
import { shortAddress } from "../utils/shortAddress"
import { CreateCollection } from "../modules/CreateCollection"
import { CreateRelease } from "../modules/CreateRelease"

const buttonGridStyle = { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '20px' }

export const Creator = () => {
	const { list, load, refetch } = useCollectionList()
	const [popout, setPopout] = useState(null);
	const onClose = () => setPopout(null)

	const onCreateCollection = () => setPopout(
		<Modal onClose={onClose} title='Add new collection' >
			<CreateCollection onFinish={() => {
				onClose()
				refetch()
			}} />
		</Modal >);

	const onCreateRelease = (sc) => setPopout(
		<Modal onClose={onClose} title='Add new collection' >
			<CreateRelease selectedCollection={sc} onFinish={() => {
				onClose()
				refetch()
			}} />
		</Modal >);

	if (load) return (
		<Div>
			<Spinner size="large" style={{ margin: '20px 0' }} />
		</Div>)

	return (
		<SplitLayout style={{ display: 'block' }} popout={popout}>
			<Div>
				<Title style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					All your collections are available for release. <br />
					For the release, choose any them.
					<Button size='m' onClick={onCreateCollection} before={<Icon20AddCircle />}> Add collection
					</Button>
				</Title>
				<Spacing size={40} />
				<CardGrid>
					{list.length ? [...list].reverse().map((item) =>
						<Card key={item['sc']}>
							<Button style={buttonGridStyle} onClick={() => {
								onCreateRelease(item['sc'])
							}}>
								<p>Name: {item['name']}</p>
								<p>Symbol: {item['symbol']}</p>
								<span>Address: {shortAddress(item['sc'])}</span>
							</Button>
						</Card>) : null}
				</CardGrid>
				{!list.length && <>
					<Div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
						<Div>List is empty... Create a collection</Div>
						<Spacing size={20} />
						<Button onClick={onCreateCollection}>Create</Button>
					</Div>
				</>}
			</Div>
		</SplitLayout>
	)
}