'use strict';

// TEMPLATES

const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),

    //tagList: Handlebars.compile(document.querySelector('#template-tag-list').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorList: Handlebars.compile(document.querySelector('#template-author-list').innerHTML)
};




//  SHOWING SELECTED ARTICLES SECTION
const titleClickHandler = function(event){

    event.preventDefault();
    const clickedElement = this;
    
    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for(let activeLink of activeLinks){
        activeLink.classList.remove('active');
    }
    
    /* add class 'active' to the clicked link */    
    clickedElement.classList.add('active');

    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts .active');
    for(let activeArticle of activeArticles){
        activeArticle.classList.remove('active');
    }
  
    /* get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');
    
    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);
  
    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
};
  


// OPTIONS DEFINITIONS

const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author',
    optTagsListSelector = '.tags.list',
    optAuthorsListSelector = '.authors.list',
    optCloudClassCount = 5,
    optCloudClassPrefix = 'tag-size-';


// GENERATING LINKS SECTION (by default - all of them)
function generateTitleLinks(customSelector = ''){

    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';


    /* for each article */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);

    let html = '';

    for(let article of articles){

        /* get the article id */
        const articleId = article.getAttribute('id');

        /* find the title element */
        /* get the title from the title element */
        const articleTitle = article.querySelector(optTitleSelector).innerHTML;

        /* create HTML of the link */
        //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
        const linkHTMLData = {id: articleId, title: articleTitle};
        const linkHTML = templates.articleLink(linkHTMLData);

        /* insert link into titleList */
        html = html + linkHTML;
    }
    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');
    for(let link of links){
        link.addEventListener('click', titleClickHandler);
    }

}

generateTitleLinks();





// GENERATING TAGS (LINKS) IN THE END OF EACH ARTICLE   - [NEW] AND ON THE RIGHT LIST -

function calculateTagsParams(tags){
    const params = {
        max: 0,
        min: 999999
    };

    for(let tag in tags){
        if(tags[tag] > params.max){
            params.max = tags[tag];
        }
        if(tags[tag] < params.min){
            params.min = tags[tag];
        }
    }


    return params;
}

function calculateTagClass(count, params){
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;

    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );

    return optCloudClassPrefix + classNumber;
}

function generateTags(){
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};

    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
  
    /* START LOOP: for every article: */
    for(let article of articles){
  
        /* find tags wrapper */
        const tagsWrapper = article.querySelector(optArticleTagsSelector);
  
        /* make html variable with empty string */
        let html = '';
  
        /* get tags from data-tags attribute */
        const articleTags = article.getAttribute('data-tags');
  
        /* split tags into array */
        const articleTagsArray = articleTags.split(' ');
  
        /* START LOOP: for each tag */
        for(let tag of articleTagsArray){

            /* generate HTML of the link */
            //const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li> ';
            const linkHTMLData = {tag: tag};
            const linkHTML = templates.tagLink(linkHTMLData);

            /* add generated code to html variable */
            html = html + linkHTML;

            /* [NEW] check if this link is NOT already in allTags */
            if(!allTags[tag]) {
                /* [NEW] add tag to allTags object */
                allTags[tag] = 1;
            } else {
                allTags[tag]++;
            }
  
        /* END LOOP: for each tag */
        }
  
        /* insert HTML of all the links into the tags wrapper */
        tagsWrapper.innerHTML = html;
    
    
        /* END LOOP: for every article: */
    }

    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(optTagsListSelector);



    //

    const tagsParams = calculateTagsParams(allTags);

    /* [NEW] create variable for all links HTML code */ //??
    //let allTagsHTML = '';
    const allTagsData = {tags: []};

    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){
        /* [NEW] generate code of a link and add it to allTagsHTML */
        //allTagsHTML += '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '"href="#tag-' + tag + '">' + tag + ' </a></li> ';

        //?
        //const linkHTMLData = {tag: tag, tagClass: calculateTagClass(allTags[tag], tagsParams)};
        //allTagsHTML += templates.tagList(linkHTMLData);

        allTagsData.tags.push({
            tag: tag,
            count: allTags[tag],
            tagClass: calculateTagClass(allTags[tag], tagsParams)
        });
        
        

        /* [NEW] END LOOP: for each tag in allTags: */
    }

    /* [NEW] add HTML from allTagsHTML to tagList */
    //tagList.innerHTML = allTagsHTML; ??

    tagList.innerHTML = templates.tagCloudLink(allTagsData);


}
generateTags();





// ACTION AFTER CLICKING THE TAG LINK

function tagClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();
  
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
  
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href  = clickedElement.getAttribute('href');
  
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
  
    /* find all tag links with class active */
    const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  
    /* START LOOP: for each active tag link */
    for(let tagLink of tagLinks){

        /* remove class active */
        tagLink.classList.remove('active');

        /* END LOOP: for each active tag link */
    }
  
    /* find all tag links with "href" attribute equal to the "href" constant */
    const tagLinksHREF = document.querySelectorAll('a[href="' + href + '"]');
  
    /* START LOOP: for each found tag link */
    for(let tagLinkHREF of tagLinksHREF){

        /* add class active */
        tagLinkHREF.classList.add('active');
  
        /* END LOOP: for each found tag link */
    }
  
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
}
  
function addClickListenersToTags(){
    /* find all links to tags */
    const tagLinks = document.querySelectorAll('a[href^="#tag-"]');

  
    /* START LOOP: for each link */
    for(let tagLink of tagLinks){
  
        /* add tagClickHandler as event listener for that link */
        tagLink.addEventListener('click', tagClickHandler);
  
        /* END LOOP: for each link */
    }
}
addClickListenersToTags();






// GENERATING AUTHOR IN THE BEGGINING OF EACH ARTICLE   - [NEW] AND ON THE RIGHT LIST -

function generateAuthors() {
    /* [NEW] create a new variable allAuthors with an empty object */
    let allAuthors = {};   // key - author, variable - how many articles does he/she has
    
    /* [NEW] create new array for all authors to run a for loop to generate links */
    let allAuthorsArray =[];

    /* [NEW] find list of authors in right column */
    const authorsList = document.querySelector(optAuthorsListSelector);
    /* [NEW] create variable for all links HTML code */
    let allAuthorsHTML = '';

    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for(let article of articles){

        /* find author wrapper */
        const authorWrapper = article.querySelector(optArticleAuthorSelector);

        /* get author from data-author attribute */
        const articleAuthor = article.getAttribute('data-author');

        /* generate HTML of the link */
        //const linkHTML = '<a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';
        const linkHTMLData = {articleAuthor: articleAuthor};
        const linkHTML = templates.articleAuthor(linkHTMLData);

        /* insert HTML of the link into the author wrapper */
        authorWrapper.innerHTML = linkHTML;

        
        /* [NEW] check if this author is NOT already in allAuthors */
        if(!allAuthors[articleAuthor]) {
            /* [NEW] add author to allAuthors object */
            allAuthors[articleAuthor] = 1;

            allAuthorsArray.push(articleAuthor);

        } else {
            allAuthors[articleAuthor]++;
        }
        /* END LOOP: for every article: */
    }
    

    const allAuthorsData = {authors: []};

    /* [NEW] START LOOP: for every author: */
    for(let author of allAuthorsArray){
        
        /* [NEW] generate HTML of the link for allAuthorsHTML and add it*/
        //const linkLiHTML = '<li><a href="#author-' + author + '">' + author + '</a>'+ ' (' + allAuthors[author] +')' +'</li>';
        
        allAuthorsData.authors.push({
            author: author,
            count: allAuthors[author]
        });

        
    }


    /* [NEW] insert allAuthorsHTML to the authorList */
    authorsList.innerHTML = templates.authorList(allAuthorsData);


}
generateAuthors();





// ACTION AFTER CLICKING THE AUTHOR LINK

function addClickListenersToAuthors(){
    /* find all links to authors */
    const authorLinks = document.querySelectorAll('a[href^="#author-"]');

    /* START LOOP: for each link */
    for(let authorLink of authorLinks){
  
        /* add tagClickHandler as event listener for that link */
        authorLink.addEventListener('click', authorClickHandler);
  
        /* END LOOP: for each link */
    }

}
addClickListenersToAuthors();

function authorClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href  = clickedElement.getAttribute('href');

    /* make a new constant "author" and extract author from the "href" constant */
    const author = href.replace('#author-', '');

    //
    /* find all author links with class active */
    const authorLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  
    /* START LOOP: for each active author link */
    for(let authorLink of authorLinks){

        /* remove class active */
        authorLink.classList.remove('active');

        /* END LOOP: for each active author link */
    }
  
    /* find all author links with "href" attribute equal to the "href" constant */
    const authorLinksHREF = document.querySelectorAll('a[href="' + href + '"]');
  
    /* START LOOP: for each found author link */
    for(let authorLinkHREF of authorLinksHREF){

        /* add class active */
        authorLinkHREF.classList.add('active');
  
        /* END LOOP: for each found author link */
    }
  
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
}






