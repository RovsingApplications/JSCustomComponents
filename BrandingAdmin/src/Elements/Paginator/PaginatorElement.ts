import CustomElement from '../../framework/custom-element.decorator';
import Colors from '../../framework/Constants/Colors';
import CustomHTMLBaseElement from '../CustomHTMLBaseElement';

@CustomElement({
	selector: 'paginator-element',
	template: `
		<span>
			<span class="page-button" id="first-button">Første</span>
			<span id="page-buttons-wrapper">
				<span class="page-button active">1</span>
				<span class="page-button">2</span>
				<span class="page-button">3</span>
				<span class="page-button">4</span>
				<span class="page-button">5</span>
			</span>
			<span class="page-button" id="last-button">Sidste</span>
		</span>
		<span class="page-select-wrapper">
			<label>Kunder pr. Side</label>
			<select>
				<option value="5">5</option>
				<option value="10">10</option>
				<option value="20">20</option>
				<option value="50">50</option>
				<option value="100">100</option>
			</select>
		</span>
		<span id="number-of-pages"></span>
	`,
	style: `
		@import url('https://fonts.googleapis.com/css?family=Roboto');

		.page-button {
			font-family: Roboto, sans-serif;
			font-size: 14px;
			color: ${Colors.primary};
			float: left;
			padding: 8px 16px;
			text-decoration: none;
			border-radius: 5px;
			cursor: pointer;
			transition: background-color .3s, color .3s;
		}
		
		.page-button.active{
			background-color: ${Colors.primary};
			color: white;
		}
		
		.page-button:hover:not(.active) {
			background-color: #ddd;
		}

		.page-select-wrapper {
			position: relative;
			font-family: Roboto, sans-serif;
		}
		.page-select-wrapper select {
			margin-left: 10px;
			font-size: 12px;
			width: 80px;
			height: 33px;
			border: 1px solid #d8d8d8;
			z-index: 1;
			border-radius: 5px;
			box-sizing: border-box;
			padding: 5px 10px;
			background-color: white;
			outline: none;
		}
		.page-select-wrapper label {
			color: #315c78;
			background-color: white;
			top: -11px !important;
			left: 15px !important;
			font-size: 10px !important;
			position: absolute;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			max-width: fit-content;
			z-index: 1;
		}

		#number-of-pages {
			font-family: Roboto, sans-serif;
			font-size: 12px;
			color: ${Colors.primary};
			margin-left: 10px;
		}
	`,
	useShadow: true,
})
export default class PaginatorElement extends CustomHTMLBaseElement {
	private maxDisplayedPageButtons = 5;
	private pageSizeElement: HTMLSelectElement;
	private numberOfPagesElement: HTMLElement;
	private pageButtonsWrapper: HTMLElement;
	private firstButton: HTMLElement;
	private lastButton: HTMLElement;

	private _pageSize = 5;
	private _currentPage = 1;
	private _totalItemsCount: number;

	private pageClicked = new Event('pageClicked');
	private pageSizeChanged = new Event('pageSizeChanged');

	public lastClickedPageNumber: number;

	constructor() {
		super();
	}

	get pageSize() {
		return this._pageSize;
	}
	set pageSize(val: number) {
		this._pageSize = val;
		this.pageSizeElement.value = val.toString();
		this.render();
	}
	get currentPage() {
		return this._currentPage;
	}
	set currentPage(val: number) {
		this._currentPage = val;
		this.render();
	}
	get totalItemsCount() {
		return this._totalItemsCount;
	}
	set totalItemsCount(val: number) {
		this._totalItemsCount = val;
		this.render();
	}
	get numberOfPages() {
		return Math.ceil(this._totalItemsCount / this._pageSize);
	}

	private render() {
		if (!this._totalItemsCount) {
			return;
		}
		if (this._currentPage < 1 || this._currentPage > this.numberOfPages) {
			this._currentPage = 1;
		}
		this.numberOfPagesElement.innerHTML = `Sider totalt: ${this.numberOfPages}`
		if (this.numberOfPages <= this.maxDisplayedPageButtons) {
			this.renderPageButtons(1, this.numberOfPages);
			return;
		}
		if (this._currentPage <= Math.ceil(this.maxDisplayedPageButtons / 2)) {
			this.renderPageButtons(1, this.maxDisplayedPageButtons);
			return;
		}
		let startPage = this._currentPage - Math.floor(this.maxDisplayedPageButtons / 2);
		let endPage = Math.min(this.maxDisplayedPageButtons + startPage - 1, this.numberOfPages);
		this.renderPageButtons(startPage, endPage);
	}

	private renderPageButtons(startPage: number, endPage: number) {
		this.pageButtonsWrapper.innerHTML = '';
		for (let i = startPage; i <= endPage; i++) {
			let pageButton = document.createElement('span');
			pageButton.classList.add('page-button');
			if (this._currentPage == i) {
				pageButton.classList.add('active');
			}
			pageButton.innerHTML = i.toString();
			pageButton.setAttribute('data-page-number', i.toString());
			this.bindPageClick(pageButton);
			this.pageButtonsWrapper.appendChild(pageButton);
		}
	}

	private bindPageClick(pageButton: HTMLElement) {
		pageButton.onclick = () => {
			let pageNumber = parseInt(pageButton.dataset['pageNumber']);
			this.lastClickedPageNumber = pageNumber;
			this.dispatchEvent(this.pageClicked);
		};
	}

	componentDidMount() {
		this.pageSizeElement = this.getChildElement('.page-select-wrapper select');
		this.pageSizeElement.value = this._pageSize.toString();
		this.numberOfPagesElement = this.getChildElement('#number-of-pages');
		this.pageButtonsWrapper = this.getChildElement('#page-buttons-wrapper');
		this.firstButton = this.getChildElement('#first-button');
		this.lastButton = this.getChildElement('#last-button');
		this.bindEvents();
		this.render();
	}

	private bindEvents() {
		this.pageSizeElement.onchange = () => {
			this._pageSize = parseInt(this.pageSizeElement.value);
			this.dispatchEvent(this.pageSizeChanged);
			this.render();
		};
		this.firstButton.onclick = () => {
			this.lastClickedPageNumber = 1;
			this.dispatchEvent(this.pageClicked);
		};
		this.lastButton.onclick = () => {
			this.lastClickedPageNumber = this.numberOfPages;
			this.dispatchEvent(this.pageClicked);
		};
	}

	private static get observedAttributes() {
		const arrtibutes = ['page-size', 'current-page', 'total-items-count'];
		return arrtibutes;
	}

	private attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'page-size':
				this._pageSize = parseInt(newVal);
				break;
			case 'current-page':
				this._currentPage = parseInt(newVal);
				break;
			case 'total-items-count':
				this._totalItemsCount = parseInt(newVal);
				break;
		}
	}
}
