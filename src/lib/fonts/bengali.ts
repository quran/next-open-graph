import { loadFileOnEdge } from '../edge';

const BENGALI_FONT_URL = '/fonts/bengali/NotoSerifBengali-Regular.ttf';

const bengali = () => loadFileOnEdge(BENGALI_FONT_URL);

export default bengali;
