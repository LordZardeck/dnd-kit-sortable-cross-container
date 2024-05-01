// externals
import { useState } from 'react';
import { ChromePicker } from 'react-color';

// dnd-kit
import { DndContext, rectIntersection } from '@dnd-kit/core';

import { DraggableItem, DropZone, Trash } from './feature/Picker';

import { Col, Item, Row } from './feature/UI';
import { ColorPalette, generateId, ItemType } from './feature/ColorPalette';
import { ColorDragOverlay } from './ColorDragOverlay.tsx';

const App = () => {
    const [pickerColor, setPickerColor] = useState('#09C5D0');
    const [favoriteColor, setFavoriteColor] = useState('#ddd');

    const [paletteItems, setPaletteItems] = useState<ItemType[]>(() =>
        ['red', 'green', 'blue'].map((color) => ({
            id: generateId(),
            color,
        })),
    );

    return (
        <div>
            <DndContext collisionDetection={rectIntersection}>
                <div>
                    <ul>
                        <li>Use the Color picker to choose a color</li>
                        <li>
                            Drag the picker or favorite color to the palette to
                            add it to the palette
                        </li>
                        <li>
                            Drag a color from the palette to the picker,
                            favorite, or trash
                        </li>
                        <li>
                            The Chosen color, Favorite color, and Trash elements
                            are implemented using the @dnd-kit/core
                        </li>
                        <li>
                            The palette is implemented using the
                            @dnd-kit/sortable presets
                        </li>
                    </ul>
                </div>
                <Row>
                    <Col>
                        <ChromePicker
                            onChange={(color) => setPickerColor(color.hex)}
                            color={pickerColor}
                        />
                    </Col>

                    <Col>
                        <Item>
                            <p>Chosen Color</p>
                            <DropZone id="current" onChange={setPickerColor}>
                                <DraggableItem
                                    color={pickerColor}
                                    id="current"
                                />
                            </DropZone>
                        </Item>
                        <Item>
                            <p>Favorite Color</p>
                            <DropZone id="favorite" onChange={setFavoriteColor}>
                                <DraggableItem
                                    color={favoriteColor}
                                    id="favorite"
                                />
                            </DropZone>
                        </Item>
                        <Item>
                            <Trash onChange={setPaletteItems} />
                        </Item>
                    </Col>

                    <Col>
                        <p>Color Palette</p>
                        <ColorPalette
                            items={paletteItems}
                            onChange={setPaletteItems}
                        />
                    </Col>
                </Row>

                <ColorDragOverlay />
            </DndContext>
        </div>
    );
};

export default App;
