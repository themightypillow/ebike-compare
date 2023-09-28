const checkboxes = document.querySelectorAll('input[type="checkbox"]');

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    fetchContent();
  });
});

function fetchContent() {
  const checkedCheckboxes = [...checkboxes].filter(box => box.checked);
  const queryString = checkedCheckboxes.map(box => `${box.dataset.group}=${box.dataset.value}`).join('&');
  fetch(`/filter?${queryString}`)
    .then(res => {
      if(!res.ok) {
        throw new Error("Bad network response");
      }
      return res.json();
    })
    .then(data => {
      updateContent(data);
    })
    .catch(error => {
      console.error(`Error fetching data: ${error}`);
    });
}

function updateContent(bikes) {
  document.querySelector('#bike-content').remove();

  document.querySelector('main > header > h3').textContent = `${bikes.length} Results`;

  const bikeContent = document.createElement('div');
  bikeContent.id = 'bike-content';

  bikes.forEach(bike => {
    const section = document.createElement('section');
    section.classList.add('bike-card');

    const image = document.createElement('img');
    image.src = `/images/${bike.id}.png`;
    image.alt = `${bike.brand} ${bike.name}`;

    const div = document.createElement('div');

    const nameDiv = document.createElement('div');
    nameDiv.classList.add('bike-name');

    const h2Name = document.createElement('h2');
    h2Name.textContent = bike.name.toUpperCase();

    const h2Brand = document.createElement('h2');
    h2Brand.classList.add('bike-brand');
    h2Brand.textContent = bike.brand.toUpperCase();

    const h3Price = document.createElement('h3');
    h3Price.textContent = `$${bike.price}`;

    const h3Type = document.createElement('h3');
    h3Type.classList.add('bike-type');
    h3Type.textContent = bike.category || 'Unknown';

    const button = document.createElement('button');

    const hr = document.createElement('hr');

    nameDiv.appendChild(h2Name);
    nameDiv.appendChild(h2Brand);

    div.appendChild(nameDiv);
    div.appendChild(h3Price);
    div.appendChild(h3Type);

    button.appendChild(makePlusSvg());

    div.appendChild(button);

    section.appendChild(image);
    section.appendChild(div);

    bikeContent.appendChild(section);
    bikeContent.appendChild(hr);
  });

  document.querySelector('main').appendChild(bikeContent);
}

function makePlusSvg() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttributeNS(null, 'width', '40');
  svg.setAttributeNS(null, 'height', '40');
  svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
  svg.setAttributeNS(null, 'stroke-width', '1.5');
  svg.setAttributeNS(null, 'stroke', '#000000');
  svg.setAttributeNS(null, 'fill', 'none');
  svg.setAttributeNS(null, 'stroke-linecap', 'round');
  svg.setAttributeNS(null, 'stroke-linejoin', 'round');

  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttributeNS(null, 'stroke', 'none');
  path1.setAttributeNS(null, 'd', 'M0 0h24v24H0');
  path1.setAttributeNS(null, 'fill', 'none');

  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttributeNS(null, 'd', 'M9 12h6');

  const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path3.setAttributeNS(null, 'd', 'M12 9v6');

  const path4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path4.setAttributeNS(null, 'd', 'M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z');

  svg.appendChild(path1);
  svg.appendChild(path2);
  svg.appendChild(path3);
  svg.appendChild(path4);

  return svg;
}