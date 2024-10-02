////////////////////////////////////////////////
// 変数                                       //
//                                            //
////////////////////////////////////////////////
const PAGE_TYPE_HOME = "home";
const PAGE_TYPE_PAGE = "page";
//const DefaultTopPageNo = 1;
//const DefaultEndPageNo = 8;
const DefaultTopPageNo = 8;
const DefaultEndPageNo = 1;
const PageNoListCount = 5;
//const PageNoOrder = 0;                        // 0 : Normal, 1 : Reverse
const PageNoOrder = 1;                        // 0 : Normal, 1 : Reverse
const PAGE_NO_ORDER_NORMAL = 0;
const PAGE_NO_ORDER_REVERSE = 1;
const ActiveClassName = "isActive";
const HomeLinkPath = "./page";
const PageLinkPath = "../../page";
let $PageNo = 0;
let $PageLink = 0;
let $TopPageLink = 0;
let $EndPageLink = 0;
let $PrevPageLink = 0;
let $NextPageLink = 0;
let $PageButton = 0;
let TopPageNo = 0;
let EndPageNo = 0;
let PageLinkLen = 0;
let PageType = 0;
let PageButtonLen = 0;
let PageSelected = 0;
let DispPageNo = 0;

////////////////////////////////////////////////
// Handler                                    //
//                                            //
////////////////////////////////////////////////
// =============================================
// Main
// =============================================
(() => {
  Init();
  SetPageLink();
  AddPageLinkEvent();
  AddPageButtonEvent();
  AddNavigationEvent();
})();

// =============================================
//
// =============================================
function Init()
{
  // -------------------------------------------
  // PageType
  // -------------------------------------------
  PageType = document.getElementsByName("pagetype").item(0).content;

  // -------------------------------------------
  // TopPageNo / EndPageNo
  // -------------------------------------------
  TopPageNo = DefaultTopPageNo;
  EndPageNo = DefaultEndPageNo;

  // -------------------------------------------
  // $PageNo
  // -------------------------------------------
  $PageNo = document.getElementsByClassName("blog_header_page_no");

  // -------------------------------------------
  // $PageLink
  // -------------------------------------------
  $PageLink = document.getElementsByClassName("pagination_unit_gp2_page_item_link");
  PageLinkLen = $PageLink.length;

  // -------------------------------------------
  // $TopPageLink / $EndPageLink
  // -------------------------------------------
  $TopPageLink = document.getElementsByClassName("pagination_unit_gp1_button_link_top");
  $EndPageLink = document.getElementsByClassName("pagination_unit_gp1_button_link_end");

  // -------------------------------------------
  // $PrevPageLink / $NextPageLink
  // -------------------------------------------
  $PrevPageLink = document.getElementsByClassName("pagination_unit_gp2_button_link_prev");
  $NextPageLink = document.getElementsByClassName("pagination_unit_gp2_button_link_next");

  // -------------------------------------------
  // $PageLink
  // -------------------------------------------
  $PageButton = document.getElementsByClassName("pagination_unit_gp1_button");
  PageButtonLen = $PageButton.length;
}

// =============================================
//
// =============================================
function SetPageLink()
{
  let StartPageNo = $PageLink[1].textContent;
  let center = Math.floor(PageNoListCount / 2);
  let start_page_no = 0;
  let end_page_no = 0;

  // -------------------------------------------
  // TopPageLink / EndPageLink 再定義
  // -------------------------------------------
  RedefineTopPageLink();
  RedefineEndPageLink();

  // -------------------------------------------
  // PageLink 再定義
  // -------------------------------------------
  switch(PageType){
    case PAGE_TYPE_HOME:
    {
      // ---------------------------------------
      // class "isActive" 削除
      // ---------------------------------------
      RemoveAllPageLinkClass(ActiveClassName);

      // ---------------------------------------
      // StartPageNo設定
      // ---------------------------------------
      StartPageNo = TopPageNo;

      // ---------------------------------------
      // PageLink再定義
      // ---------------------------------------
      RedefinePageLink(StartPageNo);

      // ---------------------------------------
      // SidePageLink再定義
      // ---------------------------------------
      RedefineSidePageLink();

      // ---------------------------------------
      // PageLinkArrow
      // ---------------------------------------
      PageLinkArrowEnable();
      break;
    }

    case PAGE_TYPE_PAGE:
    default:
    {
      // ---------------------------------------
      // class "isActive" 削除
      // ---------------------------------------
      RemoveAllPageLinkClass(ActiveClassName);

      // ---------------------------------------
      // DispPageNo
      // ---------------------------------------
      if($PageNo[0] != undefined){
          DispPageNo = $PageNo[0].textContent;
      }

      // ---------------------------------------
      // Local Storageから読出し
      // ---------------------------------------
      StartPageNo = localStorage.getItem("StartPageNo");

      // ---------------------------------------
      // StartPageNo算出
      // ---------------------------------------
      StartPageNo = ComputeStartPageNo(DispPageNo);

      // ---------------------------------------
      // PageLink再定義
      // ---------------------------------------
      RedefinePageLink(StartPageNo);

      // ---------------------------------------
      // SidePageLink再定義
      // ---------------------------------------
      RedefineSidePageLink();

      // ---------------------------------------
      // class "isActive" 再定義
      // ---------------------------------------
      RedefinePageLinkClass(ActiveClassName, DispPageNo);

      // ---------------------------------------
      // PageLinkArrow
      // ---------------------------------------
      PageLinkArrowEnable();
      break;
    }
  }
}

// =============================================
//
// =============================================
function AddPageLinkEvent()
{
  for(let i = 0 ; i < $PageLink.length ; i++){
    $PageLink[i].addEventListener('click', PageLinkHander);
  }
}

// =============================================
//
// =============================================
function PageLinkHander(e)
{
  let target = e.currentTarget;
  let PageLinkIndex = target.dataset.index;
  let StartPageNo = $PageLink[1].textContent;

  PageSelected = 1;

  switch(PageLinkIndex){
    // -----------------------------------------
    // << 要素
    // -----------------------------------------
    case "-1":
      StartPageNo = ComputePrevStartPageNo(StartPageNo);
      RedefinePageLink(StartPageNo);
      RemoveAllPageLinkClass(ActiveClassName);

      if(PageType != PAGE_TYPE_HOME){
        RedefinePageLinkClass(ActiveClassName, DispPageNo);
      }

      PageLinkArrowEnable();
      break;

    // -----------------------------------------
    // >> 要素
    // -----------------------------------------
    case "-2":
      StartPageNo = ComputeNextStartPageNo(StartPageNo);
      RedefinePageLink(StartPageNo);
      RemoveAllPageLinkClass(ActiveClassName);

      if(PageType != PAGE_TYPE_HOME){
        RedefinePageLinkClass(ActiveClassName, DispPageNo);
      }

      PageLinkArrowEnable();
      break;

    // -----------------------------------------
    // ページ番号要素
    // -----------------------------------------
    default:
      // ---------------------------------------
      // Local Storageへ書込み
      // ---------------------------------------
      localStorage.setItem("StartPageNo", StartPageNo);
      break;
  }
}

// =============================================
//
// =============================================
function AddPageButtonEvent()
{
  for(let i = 0 ; i < $PageButton.length ; i++){
    $PageButton[i].addEventListener('click', PageButtonHander);
  }
}

// =============================================
//
// =============================================
function PageButtonHander(e)
{
  let target = e.currentTarget;
  let PageButtonIndex = target.dataset.index;
  let StartPageNo = $PageLink[1].textContent;

  PageSelected = 1;

  switch(PageButtonIndex){
    // -----------------------------------------
    // Home Button
    // -----------------------------------------
    case "0":
      break;

    // -----------------------------------------
    // Top Page Button
    // -----------------------------------------
    case "1":
      localStorage.setItem("StartPageNo", StartPageNo);
      break;

    // -----------------------------------------
    // End Page Button
    // -----------------------------------------
    case "2":
      localStorage.setItem("StartPageNo", StartPageNo);
      break;
  }
}

// =============================================
//
// =============================================
function AddNavigationEvent()
{
  window.addEventListener('beforeunload', AddNavigationHander);
  // window.addEventListener('load', AddNavigationHander);
  //  window.addEventListener('unload', AddNavigationHander);
}

// =============================================
//
// =============================================
function AddNavigationHander(e)
{
  let NavigationType = window?.performance?.getEntriesByType("navigation")[0].type;

  if(PageSelected == 1) return;
}

// =============================================
//
// =============================================
function ComputeStartPageNo(SelectPageNo)
{
  let StartPageNo = 0;
  let start_page_no = 0;
  let end_page_no = 0;
  let center = Math.floor(PageNoListCount / 2);

  switch(PageNoOrder){
    case PAGE_NO_ORDER_NORMAL:
      start_page_no = parseInt(SelectPageNo) - center;
      end_page_no = start_page_no + (PageNoListCount - 1);

      if(start_page_no < TopPageNo){
        StartPageNo = TopPageNo;
      }
      else if(end_page_no > EndPageNo){
        StartPageNo = EndPageNo - (PageNoListCount - 1);
      }
      else{
        StartPageNo = start_page_no;
      }
      break;

    case PAGE_NO_ORDER_REVERSE:
      start_page_no = parseInt(SelectPageNo) + center;
      end_page_no = start_page_no - (PageNoListCount - 1);

      if(start_page_no > TopPageNo){
        StartPageNo = TopPageNo;
      }
      else if(end_page_no < EndPageNo){
        StartPageNo = EndPageNo + (PageNoListCount - 1);
      }
      else{
        StartPageNo = start_page_no;
      }
      break;
  }

  return StartPageNo;
}

// =============================================
//
// =============================================
function RedefineTopPageLink()
{
  let link_path = "";
  let page_link = "";

  switch(PageType){
    case PAGE_TYPE_HOME:  link_path = HomeLinkPath; break;
    case PAGE_TYPE_PAGE:  link_path = PageLinkPath; break;
    default:              link_path = PageLinkPath; break;
  }

  page_link = link_path + "/" + TopPageNo + "/blog.html";

  $TopPageLink[0].href = page_link;
}

// =============================================
//
// =============================================
function RedefineEndPageLink()
{
  let link_path = "";
  let page_link = "";

  switch(PageType){
    case PAGE_TYPE_HOME:  link_path = HomeLinkPath; break;
    case PAGE_TYPE_PAGE:  link_path = PageLinkPath; break;
    default:              link_path = PageLinkPath; break;
  }

  page_link = link_path + "/" + EndPageNo + "/blog.html";

  $EndPageLink[0].href = page_link;
}

// =============================================
//
// =============================================
function RedefinePageLink(startPageNo)
{
  let page_no = parseInt(startPageNo);
  let pix = 0;
  let link_path = "";
  let prev_page_link = "";
  let next_page_link = "";

  for(let i = 0 ; i < PageNoListCount ; i++){
    pix = i + 1;

    // -----------------------------------------
    // PageNo
    // -----------------------------------------
    $PageLink[pix].textContent = page_no;

    // -----------------------------------------
    // PageLink
    // -----------------------------------------
    link_path = "";

    switch(PageType){
      case PAGE_TYPE_HOME:  link_path = HomeLinkPath; break;
      case PAGE_TYPE_PAGE:  link_path = PageLinkPath; break;
      default:              link_path = PageLinkPath; break;
    }

    page_link = link_path + "/" + page_no + "/blog.html";

    $PageLink[pix].href = page_link;

    switch(PageNoOrder){
      case PAGE_NO_ORDER_NORMAL:  page_no++;  break;
      case PAGE_NO_ORDER_REVERSE: page_no--;  break;
    }
  }
}

// =============================================
//
// =============================================
function RedefineSidePageLink()
{
  let prev_page_no = 0;
  let next_page_no = 0;
  let link_path = "";
  let prev_page_link = "";

  switch(PageType){
  // -----------------------------------------
  // Home
  // -----------------------------------------
  case PAGE_TYPE_HOME:
    link_path = HomeLinkPath;

    // ---------------------------------------
    // 前ページ リンク
    // ---------------------------------------
    prev_page_link = "#";
    $PrevPageLink[0].href = prev_page_link;

    // ---------------------------------------
    // 次ページ リンク
    // ---------------------------------------
    next_page_no = TopPageNo;
    next_page_link = link_path + "/" + next_page_no + "/blog.html";
    $NextPageLink[0].href = next_page_link;
    break;

  // -----------------------------------------
  // Page
  // -----------------------------------------
  case PAGE_TYPE_PAGE:
    link_path = PageLinkPath;

    prev_page_no = parseInt(DispPageNo);
    next_page_no = parseInt(DispPageNo);

    switch(PageNoOrder){
    case PAGE_NO_ORDER_NORMAL:
      // -------------------------------------
      // 前ページ リンク
      // -------------------------------------
      prev_page_no--;

      if(prev_page_no >= TopPageNo){
        prev_page_link = link_path + "/" + prev_page_no + "/blog.html";
      }
      else{
        prev_page_link = "#";
      }

      $PrevPageLink[0].href = prev_page_link;

      // -------------------------------------
      // 次ページ リンク
      // -------------------------------------
      next_page_no++;

      if(next_page_no <= EndPageNo){
        next_page_link = link_path + "/" + next_page_no + "/blog.html";
      }
      else{
        next_page_link = "#";
      }

      $NextPageLink[0].href = next_page_link;
      break;

    case PAGE_NO_ORDER_REVERSE:
      // -------------------------------------
      // 前ページ リンク
      // -------------------------------------
      prev_page_no++;

      if(prev_page_no <= TopPageNo){
        prev_page_link = link_path + "/" + prev_page_no + "/blog.html";
      }
      else{
        prev_page_link = "#";
      }

      $PrevPageLink[0].href = prev_page_link;

      // -------------------------------------
      // 次ページ リンク
      // -------------------------------------
      next_page_no--;

      if(next_page_no >= EndPageNo){
        next_page_link = link_path + "/" + next_page_no + "/blog.html";
      }
      else{
        next_page_link = "#";
      }

      $NextPageLink[0].href = next_page_link;
      break;
    }
    break;
  }
}

// =============================================
//
// =============================================
function RedefinePageLinkClass(ClassName, SelectPageNo)
{
  let pix = 0;

  for(let i = 0 ; i < PageNoListCount ; i++){
    pix = i + 1;

    if($PageLink[pix].textContent == SelectPageNo){
      $PageLink[pix].classList.add(ClassName);
      break;
    }
  }
}

// =============================================
//
// =============================================
function RemoveAllPageLinkClass(ClassName)
{
  for(let i = 0 ; i < PageLinkLen ; i++){
    $PageLink[i].classList.remove(ClassName);
  }
}

// =============================================
//
// =============================================
function ComputePrevStartPageNo(startPageNo)
{
  let start_page_no = 0;
  let end_page_no = 0;

  switch(PageNoOrder){
    case PAGE_NO_ORDER_NORMAL:
      start_page_no = parseInt(startPageNo) - (PageNoListCount - 1);

      if(start_page_no < TopPageNo){
        StartPageNo = TopPageNo;
      }
      break;

    case PAGE_NO_ORDER_REVERSE:
      start_page_no = parseInt(startPageNo) + (PageNoListCount - 1);

      if(start_page_no > TopPageNo){
        StartPageNo = TopPageNo;
      }
      break;
  }

  return StartPageNo;
}

// =============================================
//
// =============================================
function ComputeNextStartPageNo(startPageNo)
{
  let start_page_no = 0;
  let end_page_no = 0;

  switch(PageNoOrder){
    case PAGE_NO_ORDER_NORMAL:
      start_page_no = parseInt(startPageNo) + PageNoListCount;
      end_page_no = start_page_no + (PageNoListCount - 1);

      if(end_page_no > EndPageNo){
        StartPageNo = EndPageNo - (PageNoListCount - 1);
      }
      break;

    case PAGE_NO_ORDER_REVERSE:
      start_page_no = parseInt(startPageNo) - PageNoListCount;
      end_page_no = start_page_no - (PageNoListCount - 1);

      if(end_page_no < EndPageNo){
        StartPageNo = EndPageNo + (PageNoListCount - 1);
      }
      break;
  }

  return StartPageNo;
}

// =============================================
//
// =============================================
function PageLinkArrowEnable()
{
  let PageNo = 0;
  let PageLinkStartIndex = 1;
  let PageLinkEndIndex = PageLinkLen - 2;
  let PageLinkArrowLeftIndex = 0;
  let PageLinkArrowRightIndex = PageLinkLen - 1;

  // -------------------------------------------
  // Arrow Left
  // -------------------------------------------
  PageNo = parseInt($PageLink[PageLinkStartIndex].textContent);

  if(PageNo == TopPageNo){
    $PageLink[PageLinkArrowLeftIndex].style.pointerEvents = "none";
  }
  else{
    $PageLink[PageLinkArrowLeftIndex].style.pointerEvents = "auto";
  }

  // -------------------------------------------
  // Arrow Left
  // -------------------------------------------
  PageNo = parseInt($PageLink[PageLinkEndIndex].textContent);

  if(PageNo == EndPageNo){
    $PageLink[PageLinkArrowRightIndex].style.pointerEvents = "none";
  }
  else{
    $PageLink[PageLinkArrowRightIndex].style.pointerEvents = "auto";
  }
}
