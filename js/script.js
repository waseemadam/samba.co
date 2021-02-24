"use strict";


(function () {

  /**
   * Global variables
   */

  var userAgent = navigator.userAgent.toLowerCase(),
    initialDate = new Date(),

    $document = $(document),
    $window = $(window),
    $html = $("html"),

    isDesktop = $html.hasClass("desktop"),
    isRtl = $html.attr("dir") === "rtl",
    isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTouch = "ontouchstart" in window,
    onloadCaptchaCallback,
    plugins = {
      pointerEvents: isIE < 11 ? "js/pointer-events.min.js" : false,
      bootstrapTooltip: $("[data-toggle='tooltip']"),
      bootstrapModalDialog: $('.modal'),
      bootstrapTabs: $(".tabs-custom-init"),
      rdNavbar: $(".rd-navbar"),
      materialParallax: $(".parallax-container"),
      rdGoogleMaps: $(".rd-google-map"),
      rdMailForm: $(".rd-mailform"),
      rdInputLabel: $(".form-label"),
      regula: $("[data-constraints]"),
      owl: $(".owl-carousel"),
      swiper: $(".swiper-slider"),
      search: $(".rd-search"),
      searchResults: $('.rd-search-results'),
      statefulButton: $('.btn-stateful'),
      gradientMove: $('.page-canvas-gradient'),
      isotope: $(".isotope"),
      popover: $('[data-toggle="popover"]'),
      viewAnimate: $('.view-animate'),
      radio: $("input[type='radio']"),
      checkbox: $("input[type='checkbox']"),
      customToggle: $("[data-custom-toggle]"),
      facebookWidget: $('#fb-root'),
      counter: $(".counter"),
      progressLinear: $(".progress-linear"),
      circleProgress: $(".progress-bar-circle"),
      dateCountdown: $('.DateCountdown'),
      pageLoader: $(".page-loader"),
      captcha: $('.recaptcha'),
      scroller: $(".scroll-wrap"),
      lightGallery: $("[data-lightgallery='group']"),
      lightGalleryItem: $("[data-lightgallery='item']"),
      mailchimp: $('.mailchimp-mailform'),
      campaignMonitor: $('.campaign-mailform'),
      copyrightYear: $("#copyright-year"),
      starfield: $("#starfield"),
      fullpage: $("#fullpage"),
      fss: $("#fss-container"),
      sketch: $("#sketch-container")[0],
      countDown: $(".countdown"),
      particles: $("#particles-js"),
      glitch: $(".glitch"),
      videoBG: $(".vide"),
      game2048: $(".game-container"),
      pacman: $("#pacman"),
      parallaxJs: document.getElementsByClassName('parallax-scene-js')
    };



  /**
   * Initialize All Scripts
   */
  $document.ready(function () {
    var isNoviBuilder = window.xMode;

    /**
     * getSwiperHeight
     * @description  calculate the height of swiper slider basing on data attr
     */
    function getSwiperHeight(object, attr) {
      var val = object.attr("data-" + attr),
        dim;

      if (!val) {
        return undefined;
      }

      dim = val.match(/(px)|(%)|(vh)$/i);

      if (dim.length) {
        switch (dim[0]) {
          case "px":
            return parseFloat(val);
          case "vh":
            return $window.height() * (parseFloat(val) / 100);
          case "%":
            return object.width() * (parseFloat(val) / 100);
        }
      } else {
        return undefined;
      }
    }

    /**
     * toggleSwiperInnerVideos
     * @description  toggle swiper videos on active slides
     */
    function toggleSwiperInnerVideos(swiper) {
      var prevSlide = $(swiper.slides[swiper.previousIndex]),
        nextSlide = $(swiper.slides[swiper.activeIndex]),
        videos,
        videoItems = prevSlide.find("video");

      for(i = 0; i < videoItems.length; i++) {
        videoItems[i].pause();
      }

      videos = nextSlide.find("video");
      if (videos.length) {
        videos.get(0).play();
      }
    }

    /**
     * toggleSwiperCaptionAnimation
     * @description  toggle swiper animations on active slides
     */
    function toggleSwiperCaptionAnimation(swiper) {
      var prevSlide = $(swiper.container).find("[data-caption-animate]"),
        nextSlide = $(swiper.slides[swiper.activeIndex]).find("[data-caption-animate]"),
        delay,
        duration,
        nextSlideItem,
        prevSlideItem;

      for (i = 0; i < prevSlide.length; i++) {
        prevSlideItem = $(prevSlide[i]);

        prevSlideItem.removeClass("animated")
          .removeClass(prevSlideItem.attr("data-caption-animate"))
          .addClass("not-animated");
      }

      for (i = 0; i < nextSlide.length; i++) {
        nextSlideItem = $(nextSlide[i]);
        delay = nextSlideItem.attr("data-caption-delay");
        duration = nextSlideItem.attr('data-caption-duration');

        var tempFunction = function (nextSlideItem, duration) {
          return function(){
            nextSlideItem
              .removeClass("not-animated")
              .addClass(nextSlideItem.attr("data-caption-animate"))
              .addClass("animated");

            if (duration) {
              nextSlideItem.css('animation-duration', duration + 'ms');
            }
          };
        };

        setTimeout(tempFunction(nextSlideItem, duration), delay ? parseInt(delay, 10) : 0);
      }
    }

    /**
     * initOwlCarousel
     * @description  Init owl carousel plugin
     */
    function initOwlCarousel(c) {
      var aliaces = ["-", "-xs-", "-sm-", "-md-", "-lg-"],
        values = [0, 480, 768, 992, 1200],
        responsive = {},
        j, k;

      for (j = 0; j < values.length; j++) {
        responsive[values[j]] = {};
        for (k = j; k >= -1; k--) {
          if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
            responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
          }
          if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
            responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
          }
          if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
            responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
          }
        }
      }

      // Enable custom pagination
      if (c.attr('data-dots-custom')) {
        c.on("initialized.owl.carousel", function (event) {
          var carousel = $(event.currentTarget),
            customPag = $(carousel.attr("data-dots-custom")),
            active = 0;

          if (carousel.attr('data-active')) {
            active = parseInt(carousel.attr('data-active'));
          }

          carousel.trigger('to.owl.carousel', [active, 300, true]);
          customPag.find("[data-owl-item='" + active + "']").addClass("active");

          customPag.find("[data-owl-item]").on('click', function (e) {
            e.preventDefault();
            carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item")), 300, true]);
          });

          carousel.on("translate.owl.carousel", function (event) {
            customPag.find(".active").removeClass("active");
            customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
          });
        });
      }

      c.on("initialized.owl.carousel", function (event) {
        initLightGallry($(c).parent(), 'lightGallery-in-carousel');
      });

      c.owlCarousel({
        autoplay: c.attr("data-autoplay") === "true",
        loop: isNoviBuilder ? false : c.attr("data-loop") !== "false",
        items: 1,
        center: true,
        autoplaySpeed: 600,
        rtl: isRtl,
        dotsContainer: c.attr("data-pagination-class") || false,
        navContainer: c.attr("data-navigation-class") || false,
        mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
        nav: c.attr("data-nav") === "true",
        dots: c.attr("data-dots") === "true",
        dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each")) : false,
        animateIn: c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
        animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
        responsive: responsive,
        navText: $.parseJSON(c.attr("data-nav-text")) || [],
        navClass: $.parseJSON(c.attr("data-nav-class")) || ['owl-prev', 'owl-next'],
      });
    }

    /**
     * isScrolledIntoView
     * @description  check the element whas been scrolled into the view
     */
    function isScrolledIntoView(elem) {
      if  (!isNoviBuilder){
        return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
      }
      else{
        return true;
      }
    }

    /**
     * initOnView
     * @description  calls a function when element has been scrolled into the view
     */
    function lazyInit(element, func) {
      var $win = jQuery(window);
      $win.on('load scroll', function () {
        if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
          func.call();
          element.addClass('lazy-loaded');
        }
      });
    }

    /**
     * Live Search
     * @description  create live search results
     */
    function liveSearch(options) {
      options.live.removeClass('cleared').html();
      options.current++;
      options.spin.addClass('loading');

      $.get(handler, {
        s: decodeURI(options.term),
        liveSearch: options.element.attr('data-search-live'),
        dataType: "html",
        liveCount: options.liveCount,
        filter: options.filter,
        template: options.template
      }, function (data) {
        options.processed++;
        var live = options.live;
        if (options.processed == options.current && !live.hasClass('cleared')) {
          live.find('> #search-results').removeClass('active');
          live.html(data);
          setTimeout(function () {
            live.find('> #search-results').addClass('active');
          }, 50);
        }
        options.spin.parents('.rd-search').find('.input-group-addon').removeClass('loading');
      })
    }

    /**
     * attachFormValidator
     * @description  attach form validation to elements
     */
    function attachFormValidator(elements) {
      for (var i = 0; i < elements.length; i++) {
        var o = $(elements[i]), v;
        o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
        v = o.parent().find(".form-validation");
        if (v.is(":last-child")) {
          o.addClass("form-control-last-child");
        }
      }

      elements
        .on('input change propertychange blur', function (e) {
          var $this = $(this), results;

          if (e.type != "blur") {
            if (!$this.parent().hasClass("has-error")) {
              return;
            }
          }

          if ($this.parents('.rd-mailform').hasClass('success')) {
            return;
          }

          if ((results = $this.regula('validate')).length) {
            for (i = 0; i < results.length; i++) {
              $this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error")
            }
          } else {
            $this.siblings(".form-validation").text("").parent().removeClass("has-error")
          }
        })
        .regula('bind');

      var regularConstraintsMessages = [
        {
          type: regula.Constraint.Required,
          newMessage: "The text field is required."
        },
        {
          type: regula.Constraint.Email,
          newMessage: "The email is not a valid email."
        },
        {
          type: regula.Constraint.Numeric,
          newMessage: "Only numbers are required"
        },
        {
          type: regula.Constraint.Selected,
          newMessage: "Please choose an option."
        }
      ];


      for (var i = 0; i < regularConstraintsMessages.length; i++) {
        var regularConstraint = regularConstraintsMessages[i];

        regula.override({
          constraintType: regularConstraint.type,
          defaultMessage: regularConstraint.newMessage
        });
      }
    }

    /**
     * isValidated
     * @description  check if all elemnts pass validation
     */
    function isValidated(elements, captcha) {
      var results, errors = 0;

      if (elements.length) {
        for (j = 0; j < elements.length; j++) {

          var $input = $(elements[j]);
          if ((results = $input.regula('validate')).length) {
            for (k = 0; k < results.length; k++) {
              errors++;
              $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
            }
          } else {
            $input.siblings(".form-validation").text("").parent().removeClass("has-error")
          }
        }

        if (captcha) {
          if (captcha.length) {
            return validateReCaptcha(captcha) && errors == 0
          }
        }

        return errors == 0;
      }
      return true;
    }

    /**
     * Init Bootstrap tooltip
     * @description  calls a function when need to init bootstrap tooltips
     */
    function initBootstrapTooltip(tooltipPlacement) {
      if (window.innerWidth < 599) {
        plugins.bootstrapTooltip.tooltip('destroy');
        plugins.bootstrapTooltip.tooltip({
          placement: 'bottom'
        });
      } else {
        plugins.bootstrapTooltip.tooltip('destroy');
        plugins.bootstrapTooltip.tooltip();
      }
    }

    (function() {

      var width, height, canvas, ctx, points, target, animateHeader = true;

      if($('#star-canvas').length){
        // Main
        initHeader();
        initAnimation();
        addListeners();
      }

      function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width/2, y: height/2};

        canvas = document.getElementById('star-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create points
        points = [];
        for(var x = 0; x < width; x = x + width/20) {
          for(var y = 0; y < height; y = y + height/20) {
            var px = x + Math.random()*width/20;
            var py = y + Math.random()*height/20;
            var p = {x: px, originX: px, y: py, originY: py };
            points.push(p);
          }
        }

        // for each point find the 5 closest points
        for(var i = 0; i < points.length; i++) {
          var closest = [];
          var p1 = points[i];
          for(var j = 0; j < points.length; j++) {
            var p2 = points[j]
            if(!(p1 == p2)) {
              var placed = false;
              for(var k = 0; k < 5; k++) {
                if(!placed) {
                  if(closest[k] == undefined) {
                    closest[k] = p2;
                    placed = true;
                  }
                }
              }

              for(var k = 0; k < 5; k++) {
                if(!placed) {
                  if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                    closest[k] = p2;
                    placed = true;
                  }
                }
              }
            }
          }
          p1.closest = closest;
        }

        // assign a circle to each point
        for(var i in points) {
          var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
          points[i].circle = c;
        }
      }

      // Event handling
      function addListeners() {
        if(!('ontouchstart' in window)) {
          window.addEventListener('mousemove', mouseMove);
        }
        // window.addEventListener('scroll', scrollCheck);

        window.addEventListener('resize', resize);
      }

      function mouseMove(e) {
        var posx, posy;

        posx = posy = 0;

        if (e.pageX || e.pageY) {
          posx = e.clientX;
          posy = e.clientY;
        }
        else if (e.clientX || e.clientY)    {
          posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          posy = e.clientY;
        }

        console.log(posx, posy);
        console.log(e.clientY);

        target.x = posx;
        target.y = posy;
      }

      function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
      }

      function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
      }

      // animation
      function initAnimation() {
        animate();
        for(var i in points) {
          shiftPoint(points[i]);
        }
      }

      function animate() {
        if(animateHeader) {
          ctx.clearRect(0,0,width,height);
          for(var i in points) {
            // detect points in range
            if(Math.abs(getDistance(target, points[i])) < 4000) {
              points[i].active = 0.3;
              points[i].circle.active = 0.6;
            } else if(Math.abs(getDistance(target, points[i])) < 20000) {
              points[i].active = 0.1;
              points[i].circle.active = 0.3;
            } else if(Math.abs(getDistance(target, points[i])) < 40000) {
              points[i].active = 0.02;
              points[i].circle.active = 0.1;
            } else {
              points[i].active = 0;
              points[i].circle.active = 0;
            }

            drawLines(points[i]);
            points[i].circle.draw();
          }
        }
        requestAnimationFrame(animate);
      }

      function shiftPoint(p) {
        TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
          y: p.originY-50+Math.random()*100, ease:Circle.easeInOut,
          onComplete: function() {
            shiftPoint(p);
          }});
      }

      // Canvas manipulation
      function drawLines(p) {
        if(!p.active) return;
        for(var i in p.closest) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.closest[i].x, p.closest[i].y);
          ctx.strokeStyle = 'rgba(255,255,255,'+ p.active+')';
          ctx.stroke();
        }
      }

      function Circle(pos,rad,color) {
        var _this = this;

        // constructor
        (function() {
          _this.pos = pos || null;
          _this.radius = rad || null;
          _this.color = color || null;
        })();

        this.draw = function() {
          if(!_this.active) return;
          ctx.beginPath();
          ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = 'rgba(255,255,255,'+ _this.active+')';
          ctx.fill();
        };
      }

      // Util
      function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
      }

    })();



    //------------------------------
    // Mesh Properties
    //------------------------------
    var MESH = {
      width: 1.2,
      height: 1.2,
      slices: 460,
      depth: 11,
      maxdepth: 200,
      ambient: '#555555',
      diffuse: '#FFFFFF'
    };

    //------------------------------
    // Light Properties
    //------------------------------
    var LIGHT = {
      count: 1,
      xPos : 0,
      yPos : 200,
      zOffset: 140,
      ambient: '#24415b',
      diffuse: '#4233a7',
      pickedup :true,
      proxy : false,
      currIndex : 0
    };

    //------------------------------
    // Render Properties
    //------------------------------
    var WEBGL = 'webgl';
    var CANVAS = 'canvas';
    var SVG = 'svg';
    var RENDER = {
      renderer: CANVAS
    };

    //------------------------------
    // Export Properties
    //------------------------------
    var EXPORT = {
      width: 2000,
      height: 1000,

      exportCurrent: function(){
        switch(RENDER.renderer) {
          case WEBGL:
            window.open(webglRenderer.element.toDataURL(), '_blank');
            break;
          case CANVAS:
            window.open(canvasRenderer.element.toDataURL(), '_blank');
            break;
          case SVG:
            var data = encodeURIComponent(output.innerHTML);
            var url = "data:image/svg+xml," + data;
            window.open(url, '_blank');
            break;
        }
      },
      export: function() {
        var l, x, y, light,
          scalarX = this.width / renderer.width,
          scalarY = this.height / renderer.height;

        // store a temp value of the slices
        var slices = MESH.slices;
        // Increase or decrease number of slices depending on the size of the canvas
        MESH.slices = Math.ceil(slices*scalarX*1.4);

        // Regenerate the whole canvas
        resize(this.width, this.height);

        // restore the number of slices
        MESH.slices = slices;

        // Move the lights on the plane to accomodate the size of the canvas
        for (l = scene.lights.length - 1; l >= 0; l--) {
          light = scene.lights[l];
          x = light.position[0];
          y = light.position[1];
          z = light.position[2];
          FSS.Vector3.set(light.position, x*scalarX, y*scalarY, z*scalarX);
        }

        // Update depth of the triangles
        update();
        // Render the canvas
        render();

        switch(RENDER.renderer) {
          case WEBGL:
            window.open(webglRenderer.element.toDataURL(), '_blank');
            break;
          case CANVAS:
            window.open(canvasRenderer.element.toDataURL(), '_blank');
            break;
          case SVG:
            var data = encodeURIComponent(output.innerHTML);
            var url = "data:image/svg+xml," + data;
            window.open(url, '_blank');
            break;
        }

        resize(container.offsetWidth, container.offsetHeight);

        for (l = scene.lights.length - 1; l >= 0; l--) {
          light = scene.lights[l];
          x = light.position[0];
          y = light.position[1];
          z = light.position[2];
          FSS.Vector3.set(light.position, x/scalarX, y/scalarY, z/scalarX);
        }
      }
    };


    //------------------------------
    // Global Properties
    //------------------------------
    var center = FSS.Vector3.create();
    var container = plugins.fss[0];
    var output = plugins.fss.find('#fss-output')[0];
    var renderer, scene, mesh, geometry, material;
    var webglRenderer, canvasRenderer, svgRenderer;
    var gui;

    //------------------------------
    // Methods
    //------------------------------
    function initialise() {
      createRenderer();
      createScene();
      createMesh();
      addLights();
      addEventListeners();
      addControls();
      resize(container.offsetWidth, container.offsetHeight);
      animate();
    }

    function createRenderer() {
      webglRenderer = new FSS.WebGLRenderer();
      canvasRenderer = new FSS.CanvasRenderer();
      svgRenderer = new FSS.SVGRenderer();
      setRenderer(RENDER.renderer);
    }

    function setRenderer(index) {
      if (renderer) {
        output.removeChild(renderer.element);
      }
      switch(index) {
        case WEBGL:
          renderer = webglRenderer;
          break;
        case CANVAS:
          renderer = canvasRenderer;
          break;
        case SVG:
          renderer = svgRenderer;
          break;
      }
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      output.appendChild(renderer.element);
    }

    function createScene() {
      scene = new FSS.Scene();
    }

    function createMesh() {
      scene.remove(mesh);
      renderer.clear();
      geometry = new FSS.Plane(MESH.width * renderer.width, MESH.height * renderer.height, MESH.slices);
      material = new FSS.Material(MESH.ambient, MESH.diffuse);
      mesh = new FSS.Mesh(geometry, material);
      scene.add(mesh);

      // Augment vertices for depth modification
      var v, vertex;
      for (v = geometry.vertices.length - 1; v >= 0; v--) {
        vertex = geometry.vertices[v];
        vertex.depth = 11;
        vertex.anchor = FSS.Vector3.clone(vertex.position);
      }
    }

    // Add a single light
    function addLight(ambient, diffuse, x, y, z) {
      ambient = typeof ambient !== 'undefined' ? ambient : LIGHT.ambient;
      diffuse = LIGHT.diffuse;
      x = typeof x !== 'undefined' ? x : LIGHT.xPos;
      y = typeof y !== 'undefined' ? y : LIGHT.yPos;
      z = typeof z !== 'undefined' ? z : LIGHT.zOffset;

      renderer.clear();
      var light = new FSS.Light(ambient, diffuse);
      light.ambientHex = light.ambient.format();
      light.diffuseHex = light.diffuse.format();
      light.setPosition(x, y, z);
      scene.add(light);
      LIGHT.diffuse = diffuse;
      LIGHT.proxy = light;
      LIGHT.pickedup = true;
      LIGHT.currIndex++;
    }

    function addLights() {
      var num = 1;

      for (var i = num - 1; i >= 0; i--) {
        addLight();
        LIGHT.count++;
      };
    }

    // Remove lights
    function trimLights(value) {
      for (var l = value; l <= scene.lights.length; l++) {
        var light = scene.lights[l];
        scene.remove(light);
        LIGHT.currIndex--;
      }
      LIGHT.proxy = scene.lights[LIGHT.currIndex-1];
      LIGHT.pickedup = false;

      renderer.clear();
    }

    // Resize canvas
    function resize(width, height) {
      renderer.setSize(width, height);
      FSS.Vector3.set(center, renderer.halfWidth, renderer.halfHeight);
      createMesh();
    }

    function animate() {
      update();
      render();
      requestAnimationFrame(animate);
    }

    function update() {
      var v, vertex, offset = MESH.depth/100;

      // Add depth to Vertices
      for (v = geometry.vertices.length - 1; v >= 0; v--) {
        vertex = geometry.vertices[v];
        FSS.Vector3.set(vertex.position, 1, 1, vertex.depth*offset);
        FSS.Vector3.add(vertex.position, vertex.anchor);
      }

      // Set the Geometry to dirty
      geometry.dirty = true;
    }

    function render() {
      renderer.render(scene);
    }

    function addEventListeners() {
      window.addEventListener('resize', onWindowResize);
      window.addEventListener('mousemove', onMouseMove);
    }

    function addControls() {
      var i, l, light, folder, controller;

      // Create GUI
      gui = new dat.GUI({autoPlace:false});


      // Create folders
      var renderFolder = gui.addFolder('Render');
      var meshFolder = gui.addFolder('Mesh');
      var lightFolder = gui.addFolder('Light');
      var exportFolder = gui.addFolder('Export');

      // Open folders
      lightFolder.open();

      // Add Render Controls
      controller = renderFolder.add(RENDER, 'renderer', {webgl:WEBGL, canvas:CANVAS, svg:SVG});
      controller.onChange(function(value) {
        setRenderer(value);
      });

      // Add Mesh Controls
      controller = meshFolder.addColor(MESH, 'ambient');
      controller.onChange(function(value) {
        for (i = 0, l = scene.meshes.length; i < l; i++) {
          scene.meshes[i].material.ambient.set(value);
        }
      });
      controller = meshFolder.addColor(MESH, 'diffuse');
      controller.onChange(function(value) {
        for (i = 0, l = scene.meshes.length; i < l; i++) {
          scene.meshes[i].material.diffuse.set(value);
        }
      });
      controller = meshFolder.add(MESH, 'width', 0.05, 2);
      controller.onChange(function(value) {
        if (geometry.width !== value * renderer.width) { createMesh(); }
      });
      controller = meshFolder.add(MESH, 'height', 0.05, 2);
      controller.onChange(function(value) {
        if (geometry.height !== value * renderer.height) { createMesh(); }
      });

      controller = meshFolder.add(MESH, 'depth', 0, MESH.maxdepth).listen();

      controller = meshFolder.add(MESH, 'slices', 1, 800);
      controller.step(1);
      controller.onChange(function(value) {
        if (geometry.slices !== value) { createMesh(); }
      });

      // Add Light Controls
      // TODO: add the number of lights dynamically
      controller = lightFolder.add(LIGHT, 'currIndex', {1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7}).name('Current light').listen();
      controller.onChange(function(value) {
        LIGHT.proxy = scene.lights[value-1];

        LIGHT.ambient = LIGHT.proxy.ambient.hex;
        LIGHT.diffuse = LIGHT.proxy.diffuse.hex;
        LIGHT.xPos    = LIGHT.proxy.position[0];
        LIGHT.yPos    = LIGHT.proxy.position[1];
        LIGHT.zOffset = LIGHT.proxy.position[2];

        // Hacky way to allow manual update of the HEX colors for light's ambient and diffuse
        gui.__folders.Light.__controllers[1].updateDisplay();
        gui.__folders.Light.__controllers[2].updateDisplay();
      });

      controller = lightFolder.addColor(LIGHT, 'ambient');
      controller.onChange(function(value) {
        LIGHT.proxy.ambient.set(value);
        LIGHT.proxy.ambientHex =  LIGHT.proxy.ambient.format();
      });

      controller = lightFolder.addColor(LIGHT, 'diffuse');
      controller.onChange(function(value) {
        LIGHT.proxy.diffuse.set(value);
        LIGHT.proxy.diffuseHex = LIGHT.proxy.diffuse.format();
      });

      controller = lightFolder.add(LIGHT, 'count', 1, 7).listen();
      controller.step(1);
      controller.onChange(function(value) {
        if (scene.lights.length !== value) {
          // If the value is more then the number of lights, add lights, otherwise delete lights from the scene
          if (value > scene.lights.length) {
            addLight();
          } else {
            trimLights(value);
          }
        }
      });

      controller = lightFolder.add(LIGHT, 'xPos', -mesh.geometry.width/2, mesh.geometry.width/2).listen();
      controller.step(1);
      controller.onChange(function(value) {
        LIGHT.proxy.setPosition(value, LIGHT.proxy.position[1], LIGHT.proxy.position[2]);
      });

      controller = lightFolder.add(LIGHT, 'yPos', -mesh.geometry.height/2, mesh.geometry.height/2).listen();
      controller.step(1);
      controller.onChange(function(value) {
        LIGHT.proxy.setPosition(LIGHT.proxy.position[0], value, LIGHT.proxy.position[2]);
      });



      /* JQuery Block ****
       ** Two different binds called to allow for mouse-scroll modification of
       ** z-offset. One of the binds handle specifically for Firefox,
       ** and the other handles for IE, Opera and Safari
       ** Works in: Opera, Safari, IE9+. and Chrome.
       ** NaN Error in Firefox.
       */

      controller = lightFolder.add(LIGHT, 'zOffset', 0, 1000).name('Distance').listen();
      var scrollButtonDistance = Number(LIGHT.proxy.position[2]);


      /* End JQuery Block */

      controller.step(1);
      controller.onChange(function(value) {
        LIGHT.proxy.setPosition(LIGHT.proxy.position[0], LIGHT.proxy.position[1], value);
      });

      // Add Export Controls
      controller = exportFolder.add(EXPORT, 'width', 100, 3000);
      controller.step(100);
      controller = exportFolder.add(EXPORT, 'height', 100, 3000);
      controller.step(100);
      controller = exportFolder.add(EXPORT, 'export').name('export big');
      controller = exportFolder.add(EXPORT, 'exportCurrent').name('export this');

    }

    //------------------------------
    // Callbacks
    //------------------------------

    function onWindowResize(event) {
      resize(container.offsetWidth, container.offsetHeight);
      render();
    }

    function onMouseMove(event) {
      if(LIGHT.pickedup){
        LIGHT.xPos = (event.x || event.clientX) - renderer.width/2;
        LIGHT.yPos = renderer.height/2 - (event.y || event.clientY);
        LIGHT.proxy.setPosition(LIGHT.xPos, LIGHT.yPos, LIGHT.proxy.position[2]);
      }
    }


    function Particle( x, y, radius ) {
      this.init( x, y, radius );
    }

    /**
     * Sketch
     * @description  init Sketch
     */
    if(plugins.sketch){

      Particle.prototype = {

        init: function( x, y, radius ) {

          this.alive = true;

          this.radius = radius || 10;
          this.wander = 0.15;
          this.theta = random( TWO_PI );
          this.drag = 0.92;
          this.color = '#fff';

          this.x = x || 0.0;
          this.y = y || 0.0;

          this.vx = 0.0;
          this.vy = 0.0;
        },

        move: function() {

          this.x += this.vx;
          this.y += this.vy;

          this.vx *= this.drag;
          this.vy *= this.drag;

          this.theta += random( -0.5, 0.5 ) * this.wander;
          this.vx += sin( this.theta ) * 0.1;
          this.vy += cos( this.theta ) * 0.1;

          this.radius *= 0.96;
          this.alive = this.radius > 0.5;
        },

        draw: function( ctx ) {

          ctx.beginPath();
          ctx.arc( this.x, this.y, this.radius, 0, TWO_PI );
          ctx.fillStyle = this.color;
          ctx.fill();
        }
      };

      var MAX_PARTICLES = 180;
      var COLOURS = [ '#69D2E7', '#A7DBD8', '#20FC8F', '#F38630', '#FA6900', '#FF4E50', '#009DDC' ];

      var particles = [];
      var pool = [];

      var demo = Sketch.create({
        container: plugins.sketch,
        retina: 'auto'
      });

      demo.setup = function() {

        // Set off some initial particles.
        var i, x, y;

        for ( i = 0; i < 20; i++ ) {
          x = ( demo.width * 0.5 ) + random( -100, 100 );
          y = ( demo.height * 0.5 ) + random( -100, 100 );
          demo.spawn( x, y );
        }
      };

      demo.spawn = function( x, y ) {

        var particle, theta, force;

        if ( particles.length >= MAX_PARTICLES )
          pool.push( particles.shift() );

        particle = pool.length ? pool.pop() : new Particle();
        particle.init( x, y, random( 5, 40 ) );

        particle.wander = random( 0.5, 2.0 );
        particle.color = random( COLOURS );
        particle.drag = random( 0.9, 0.99 );

        theta = random( TWO_PI );
        force = random( 2, 8 );

        particle.vx = sin( theta ) * force;
        particle.vy = cos( theta ) * force;

        particles.push( particle );
      };

      demo.update = function() {

        var i, particle;

        for ( i = particles.length - 1; i >= 0; i-- ) {

          particle = particles[i];

          if ( particle.alive ) particle.move();
          else pool.push( particles.splice( i, 1 )[0] );
        }
      };

      demo.draw = function() {

        demo.globalCompositeOperation  = 'lighter';

        for ( var i = particles.length - 1; i >= 0; i-- ) {
          particles[i].draw( demo );
        }
      };

      demo.mousemove = function() {

        var particle, theta, force, touch, max, i, j, n;

        for ( i = 0, n = demo.touches.length; i < n; i++ ) {

          touch = demo.touches[i], max = random( 1, 4 );
          for ( j = 0; j < max; j++ ) {
            demo.spawn( touch.x, touch.y );
          }

        }
      };
    }


    /**
     * fss
     * @description  init fss
     */
    if(plugins.fss.length){
      // initialise();
    }


    /**
     * Starfie
     * @description  init starfie
     */
    if(plugins.starfield.length){
      window.start();
    }

    /**
     * particles
     * @description  init particles
     */
    if(plugins.particles.length){
      particlesJS("particles-js", 'es_json');
    }


    /**
     * fullpage
     * @description  init fullpage
     */
    if(plugins.fullpage.length){
      plugins.fullpage.fullpage({
        //section0,section1,section2
        anchors: plugins.fullpage.data('ancors').split(','),
        navigationTooltips: "Home About Contact".split(" "),
        slidesNavigation: true,
        showActiveTooltip: !1,
        menu: "#fp-nav",
        scrollBar: plugins.fullpage.data('scroll'),
        css3: true,
        scrollingSpeed: 800,
        responsiveWidth: 992
      });

      $('.fullpage-to-slide').on('click', function(e) {
        e.preventDefault();
        $.fn.fullpage.moveTo($(this).attr('href'));
      });
    }


    /**
     * RD Video
     * @description Enables RD Video plugin
     */
    if (plugins.videoBG.length) {
      plugins.videoBG.vide(plugins.videoBG.attr('data-video-path'));
    }


    /**
     * Starfie
     * @description  init starfie
     */
    if(plugins.glitch.length){
      plugins.glitch.mgGlitch({
        // set 'true' to stop the plugin
        destroy : false,
        // set 'false' to stop glitching
        glitch: true,
        // set 'false' to stop scaling
        scale: true,
        // set 'false' to stop glitch blending
        blend : true,
        // select blend mode type
        blendModeType : 'hue',
        // set min time for glitch 1 elem
        glitch1TimeMin : 200,
        // set max time for glitch 1 elem
        glitch1TimeMax : 400,
        // set min time for glitch 2 elem
        glitch2TimeMin : 10,
        // set max time for glitch 2 elem
        glitch2TimeMax : 100,
      });
    }


      /**
       * Enable parallax by mouse
       */
      if(plugins.parallaxJs){
        for(var i = 0; i < plugins.parallaxJs.length; i++){
          var scene = plugins.parallaxJs[i];
          new Parallax(scene);
        }
      }


    /**
     * Gradient animation
     * @description  Animate bg on mouse move
     */
    if (plugins.gradientMove.length) {
      var blendAmount = 50;
      var delay = 0;
      var windowWidth = window.innerWidth;

      document.onmousemove = function(e) {
        var mouseX = Math.round(e.pageX / windowWidth * 100 - delay);

        plugins.gradientMove[0].style.background = "linear-gradient(45deg, #111 " + (mouseX - blendAmount) + "%,#0a354e " + (mouseX + blendAmount) + "%)";
      };
    }

    /**
     * Copyright Year
     * @description  Evaluates correct copyright year
     */
    if (plugins.copyrightYear.length) {
      plugins.copyrightYear.text(initialDate.getFullYear());
    }


    /**
     * Copyright Year
     * @description  Evaluates correct copyright year
     */
    if (plugins.game2048.length) {
      window.requestAnimationFrame(function () {
        var manager = new GameManager(4, KeyboardInputManager, HTMLActuator);
      });
    }


    /**
     * Copyright Year
     * @description  Evaluates correct copyright year
     */
    if (plugins.pacman.length) {
      geronimo();
    }

    /**
     * Page loader
     * @description Enables Page loader
     */
    if (plugins.pageLoader.length > 0) {
      setTimeout(function () {
        plugins.pageLoader.addClass("loaded");
        $window.trigger("resize");
      }, 1000);
    }

    /**
     * validateReCaptcha
     * @description  validate google reCaptcha
     */
    function validateReCaptcha(captcha) {
      var $captchaToken = captcha.find('.g-recaptcha-response').val();

      if ($captchaToken == '') {
        captcha
          .siblings('.form-validation')
          .html('Please, prove that you are not robot.')
          .addClass('active');
        captcha
          .closest('.form-group')
          .addClass('has-error');

        captcha.on('propertychange', function () {
          var $this = $(this),
            $captchaToken = $this.find('.g-recaptcha-response').val();

          if ($captchaToken != '') {
            $this
              .closest('.form-group')
              .removeClass('has-error');
            $this
              .siblings('.form-validation')
              .removeClass('active')
              .html('');
            $this.off('propertychange');
          }
        });

        return false;
      }

      return true;
    }


    /**
     * onloadCaptchaCallback
     * @description  init google reCaptcha
     */
    window.onloadCaptchaCallback = function () {
      for (i = 0; i < plugins.captcha.length; i++) {
        var $capthcaItem = $(plugins.captcha[i]);

        grecaptcha.render(
          $capthcaItem.attr('id'),
          {
            sitekey: $capthcaItem.attr('data-sitekey'),
            size: $capthcaItem.attr('data-size') ? $capthcaItem.attr('data-size') : 'normal',
            theme: $capthcaItem.attr('data-theme') ? $capthcaItem.attr('data-theme') : 'light',
            callback: function (e) {
              $('.recaptcha').trigger('propertychange');
            }
          }
        );
        $capthcaItem.after("<span class='form-validation'></span>");
      }
    };

    /**
     * Google ReCaptcha
     * @description Enables Google ReCaptcha
     */
    if (plugins.captcha.length) {
      $.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
    }

    /**
     * Is Mac os
     * @description  add additional class on html if mac os.
     */
    if (navigator.platform.match(/(Mac)/i)) $html.addClass("mac-os");

    /**
     * IE Polyfills
     * @description  Adds some loosing functionality to IE browsers
     */
    if (isIE) {
      if (isIE < 10) {
        $html.addClass("lt-ie-10");
      }

      if (isIE < 11) {
        if (plugins.pointerEvents) {
          $.getScript(plugins.pointerEvents)
            .done(function () {
              $html.addClass("ie-10");
              PointerEventsPolyfill.initialize({});
            });
        }
      }

      if (isIE === 11) {
        $("html").addClass("ie-11");
      }

      if (isIE === 12) {
        $("html").addClass("ie-edge");
      }
    }

    /**
     * Bootstrap Tooltips
     * @description Activate Bootstrap Tooltips
     */
    if (plugins.bootstrapTooltip.length) {
      var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');
      initBootstrapTooltip(tooltipPlacement);

      $window.on('resize orientationchange', function () {
        initBootstrapTooltip(tooltipPlacement);
      })
    }

    /**
     * bootstrapModalDialog
     * @description Stap vioeo in bootstrapModalDialog
     */
    if (plugins.bootstrapModalDialog.length > 0) {
      var i = 0;

      for (i = 0; i < plugins.bootstrapModalDialog.length; i++) {
        var modalItem = $(plugins.bootstrapModalDialog[i]);

        modalItem.on('hidden.bs.modal', $.proxy(function () {
          var activeModal = $(this),
            rdVideoInside = activeModal.find('video'),
            youTubeVideoInside = activeModal.find('iframe');

          if (rdVideoInside.length) {
            rdVideoInside[0].pause();
          }

          if (youTubeVideoInside.length) {
            var videoUrl = youTubeVideoInside.attr('src');

            youTubeVideoInside
              .attr('src', '')
              .attr('src', videoUrl);
          }
        }, modalItem))
      }
    }

    /**
     * JQuery mousewheel plugin
     * @description  Enables jquery mousewheel plugin
     */
    if (plugins.scroller.length) {
      var i;
      for (i = 0; i < plugins.scroller.length; i++) {
        var scrollerItem = $(plugins.scroller[i]);

        scrollerItem.mCustomScrollbar({
          theme: scrollerItem.attr('data-theme') ? scrollerItem.attr('data-theme') : 'minimal',
          scrollInertia: 100,
          scrollButtons: {enable: true}
        });
      }
    }


    /**
     * RD Google Maps
     * @description Enables RD Google Maps plugin
     */
    if (plugins.rdGoogleMaps.length) {
      var i;

      $.getScript("//maps.google.com/maps/api/js?key=AIzaSyAwH60q5rWrS8bXwpkZwZwhw9Bw0pqKTZM&sensor=false&libraries=geometry,places&v=3.7", function () {
        var head = document.getElementsByTagName('head')[0],
          insertBefore = head.insertBefore;

        head.insertBefore = function (newElement, referenceElement) {
          if (newElement.href && newElement.href.indexOf('//fonts.googleapis.com/css?family=Roboto') != -1 || newElement.innerHTML.indexOf('gm-style') != -1) {
            return;
          }
          insertBefore.call(head, newElement, referenceElement);
        };

        for (i = 0; i < plugins.rdGoogleMaps.length; i++) {

          var $googleMapItem = $(plugins.rdGoogleMaps[i]);

          lazyInit($googleMapItem, $.proxy(function () {
            var $this = $(this),
              styles = $this.attr("data-styles");

            $this.googleMap({
              marker: {
                basic: $this.data('marker'),
                active: $this.data('marker-active')
              },
              styles: styles ? JSON.parse(styles) : [],
              onInit: function (map) {
                var inputAddress = $('#rd-google-map-address');



                if (inputAddress.length) {
                  var input = inputAddress;
                  var geocoder = new google.maps.Geocoder();
                  var marker = new google.maps.Marker(
                    {
                      map: map,
                      icon: $this.data('marker-url'),
                    }
                  );

                  var autocomplete = new google.maps.places.Autocomplete(inputAddress[0]);
                  autocomplete.bindTo('bounds', map);
                  inputAddress.attr('placeholder', '');
                  inputAddress.on('change', function () {
                    $("#rd-google-map-address-submit").trigger('click');
                  });
                  inputAddress.on('keydown', function (e) {
                    if (e.keyCode == 13) {
                      $("#rd-google-map-address-submit").trigger('click');
                    }
                  });


                  $("#rd-google-map-address-submit").on('click', function (e) {
                    e.preventDefault();
                    var address = input.val();
                    geocoder.geocode({'address': address}, function (results, status) {
                      if (status == google.maps.GeocoderStatus.OK) {
                        var latitude = results[0].geometry.location.lat();
                        var longitude = results[0].geometry.location.lng();

                        map.setCenter(new google.maps.LatLng(
                          parseFloat(latitude),
                          parseFloat(longitude)
                        ));
                        marker.setPosition(new google.maps.LatLng(
                          parseFloat(latitude),
                          parseFloat(longitude)
                        ))
                      }
                    });
                  });
                }
              }
            });
          }, $googleMapItem));
        }
      });
    }

    /**
     * Facebook widget
     * @description  Enables official Facebook widget
     */
    if (plugins.facebookWidget.length) {
      lazyInit(plugins.facebookWidget, function () {
        (function (d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s);
          js.id = id;
          js.src = "//connect.facebook.net/en_EN/sdk.js#xfbml=1&version=v2.5";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
      });
    }

    /**
     * Radio
     * @description Add custom styling options for input[type="radio"]
     */
    if (plugins.radio.length) {
      var i;
      for (i = 0; i < plugins.radio.length; i++) {
        var $this = $(plugins.radio[i]);
        $this.addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
      }
    }

    /**
     * Checkbox
     * @description Add custom styling options for input[type="checkbox"]
     */
    if (plugins.checkbox.length) {
      var i;
      for (i = 0; i < plugins.checkbox.length; i++) {
        var $this = $(plugins.checkbox[i]);
        $this.addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
      }
    }

    /**
     * Popovers
     * @description Enables Popovers plugin
     */
    if (plugins.popover.length) {
      if (window.innerWidth < 767) {
        plugins.popover.attr('data-placement', 'bottom');
        plugins.popover.popover();
      }
      else {
        plugins.popover.popover();
      }
    }

    /**
     * Bootstrap Buttons
     * @description  Enable Bootstrap Buttons plugin
     */
    if (plugins.statefulButton.length) {
      $(plugins.statefulButton).on('click', function () {
        var statefulButtonLoading = $(this).button('loading');

        setTimeout(function () {
          statefulButtonLoading.button('reset')
        }, 2000);
      })
    }

    /**
     * UI To Top
     * @description Enables ToTop Button
     */
    if (isDesktop && !isNoviBuilder) {
      $().UItoTop({
        easingType: 'easeOutQuart',
        containerClass: 'ui-to-top fa fa-angle-up'
      });
    }

    /**
     * RD Navbar
     * @description Enables RD Navbar plugin
     */
    if (plugins.rdNavbar.length) {
      var skew = !!$('.page-skew').length;

      plugins.rdNavbar.RDNavbar({
        anchorNav: !skew,
        stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
        responsive: {
          0: {
            stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up") === 'true' : false
          },
          768: {
            stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-sm-stick-up") === 'true' : false
          },
          992: {
            stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-md-stick-up") === 'true' : false
          },
          1200: {
            stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-lg-stick-up") === 'true' : false
          }
        },
        callbacks: {
          onStuck: function () {
            var navbarSearch = this.$element.find('.rd-search input');

            if (navbarSearch) {
              navbarSearch.val('').trigger('propertychange');
            }
          },
          onDropdownOver: function(){
            return !isNoviBuilder;
          },
          onUnstuck: function () {
            if (this.$clone === null)
              return;

            var navbarSearch = this.$clone.find('.rd-search input');

            if (navbarSearch) {
              navbarSearch.val('').trigger('propertychange');
              navbarSearch.trigger('blur');
            }
          }
        }
      });

      if ($('.page-skew').length){
        $('.rd-navbar-nav a').on('click', function(e){

          $('.page-subpage').removeClass('page-subpage--active');
          $('.rd-navbar-nav li').removeClass('active');

          setTimeout(function(){
            $(e.currentTarget).parent().addClass('active');
            $(e.currentTarget.hash).addClass('page-subpage--active');
          }, 600);

          $('[data-rd-navbar-toggle=".rd-navbar-nav-wrap"]').trigger('click');
        });

        $("[data-rd-navbar-toggle='.rd-navbar-nav-wrap']").on('click', function(e){
          setTimeout(function(){
            $('.rd-navbar-nav li:not(.active) a').shuffleLetters();
          }, 300);
        });
      }

      if (plugins.rdNavbar.attr("data-body-class")) {
        document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
      }
    }


    /**
     * RD Search
     * @description Enables search
     */
    if (plugins.search.length || plugins.searchResults) {
      var handler = "bat/rd-search.php";
      var defaultTemplate = '<h5 class="search_title"><a target="_top" href="#{href}" class="search_link">#{title}</a></h5>' +
        '<p>...#{token}...</p>' +
        '<p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>';
      var defaultFilter = '*.html';

      if (plugins.search.length) {

        plugins.search = $('.' + plugins.search[0].className);

        for (i = 0; i < plugins.search.length; i++) {
          var searchItem = $(plugins.search[i]),
            options = {
              element: searchItem,
              filter: (searchItem.attr('data-search-filter')) ? searchItem.attr('data-search-filter') : defaultFilter,
              template: (searchItem.attr('data-search-template')) ? searchItem.attr('data-search-template') : defaultTemplate,
              live: (searchItem.attr('data-search-live')) ? (searchItem.find('.' + searchItem.attr('data-search-live'))) : false,
              liveCount: (searchItem.attr('data-search-live-count')) ? parseInt(searchItem.attr('data-search-live')) : 4,
              current: 0, processed: 0, timer: {}
            };

          if ($('.rd-navbar-search-toggle').length) {
            var toggle = $('.rd-navbar-search-toggle');
            toggle.on('click', function () {
              if (!($(this).hasClass('active'))) {
                searchItem.find('input').val('').trigger('propertychange');
              }
            });
          }

          if (options.live) {
            options.clearHandler = false;

            searchItem.find('input').on("keyup input propertychange", $.proxy(function () {
              var ctx = this;

              this.term = this.element.find('input').val().trim();
              this.spin = this.element.find('.input-group-addon');

              clearTimeout(ctx.timer);

              if (ctx.term.length > 2) {
                ctx.timer = setTimeout(liveSearch(ctx), 200);

                if (ctx.clearHandler == false) {
                  ctx.clearHandler = true;

                  $("body").on("click", function (e) {
                    if ($(e.toElement).parents('.rd-search').length == 0) {
                      ctx.live.addClass('cleared').html('');
                    }
                  })
                }

              } else if (ctx.term.length == 0) {
                ctx.live.addClass('cleared').html('');
              }
            }, options, this));
          }

          searchItem.on('submit', $.proxy(function () {
            $('<input />').attr('type', 'hidden')
              .attr('name', "filter")
              .attr('value', this.filter)
              .appendTo(this.element);
            return true;
          }, options, this))
        }
      }

      if (plugins.searchResults.length) {
        var regExp = /\?.*s=([^&]+)\&filter=([^&]+)/g;
        var match = regExp.exec(location.search);

        if (match != null) {
          $.get(handler, {
            s: decodeURI(match[1]),
            dataType: "html",
            filter: match[2],
            template: defaultTemplate,
            live: ''
          }, function (data) {
            plugins.searchResults.html(data);
          })
        }
      }
    }


    /**
     * jQuery Countdown
     * @description  Enable countdown plugin
     */
    if (plugins.countDown.length) {
      var i;
      for (i = 0; i < plugins.countDown.length; i++) {
        var countDownItem = plugins.countDown[i],
          d = new Date(),
          type = countDownItem.getAttribute('data-type'),
          time = countDownItem.getAttribute('data-time'),
          format = countDownItem.getAttribute('data-format'),
          settings = [];

        d.setTime(Date.parse(time)).toLocaleString();
        settings[type] = d;
        settings['format'] = format;
        $(countDownItem).countdown(settings);
      }
    }

    /**
     * ViewPort Universal
     * @description Add class in viewport
     */
    if (plugins.viewAnimate.length) {
      var i;
      for (i = 0; i < plugins.viewAnimate.length; i++) {
        var $view = $(plugins.viewAnimate[i]).not('.active');
        $document.on("scroll", $.proxy(function () {
          if (isScrolledIntoView(this)) {
            this.addClass("active");
          }
        }, $view))
          .trigger("scroll");
      }
    }


    /**
     * Swiper 3.1.7
     * @description  Enable Swiper Slider
     */
    if (plugins.swiper.length) {
      var i;
      for (i = 0; i < plugins.swiper.length; i++) {
        var s = $(plugins.swiper[i]);
        var pag = s.find(".swiper-pagination"),
          next = s.find(".swiper-button-next"),
          prev = s.find(".swiper-button-prev"),
          bar = s.find(".swiper-scrollbar"),
          swiperSlide = s.find(".swiper-slide"),
          autoplay = false;

        for (j = 0; j < swiperSlide.length; j++) {
          var $this = $(swiperSlide[j]),
            url;

          if (url = $this.attr("data-slide-bg")) {
            $this.css({
              "background-image": "url(" + url + ")",
              "background-size": "cover"
            })
          }
        }

        swiperSlide.end()
          .find("[data-caption-animate]")
          .addClass("not-animated")
          .end()
          .swiper({
            autoplay: s.attr('data-autoplay') ? s.attr('data-autoplay') === "false" ? undefined : s.attr('data-autoplay-delay') : 5000,
            direction: s.attr('data-direction') ? s.attr('data-direction') : "horizontal",
            effect: s.attr('data-slide-effect') ? s.attr('data-slide-effect') : "fade",
            speed: s.attr('data-slide-speed') ? s.attr('data-slide-speed') : 600,
            keyboardControl: s.attr('data-keyboard') === "true",
            mousewheelControl: s.attr('data-mousewheel') === "true",
            mousewheelReleaseOnEdges: s.attr('data-mousewheel-release') === "true",
            nextButton: next.length ? next.get(0) : null,
            prevButton: prev.length ? prev.get(0) : null,
            pagination: pag.length ? pag.get(0) : null,
            paginationClickable: pag.length ? pag.attr("data-clickable") !== "false" : false,
            paginationBulletRender: pag.length ? pag.attr("data-index-bullet") === "true" ? function (index, className) {
              return '<span class="' + className + '">' + (index + 1) + '</span>';
            } : null : null,
            scrollbar: bar.length ? bar.get(0) : null,
            scrollbarDraggable: bar.length ? bar.attr("data-draggable") !== "false" : true,
            scrollbarHide: bar.length ? bar.attr("data-draggable") === "false" : false,
            loop: isNoviBuilder ? false : s.attr('data-loop') !== "false",
            simulateTouch: s.attr('data-simulate-touch') && !isNoviBuilder ? s.attr('data-simulate-touch') === "true" : false,
            onTransitionStart: function (swiper) {
              toggleSwiperInnerVideos(swiper);
            },
            onTransitionEnd: function (swiper) {
              toggleSwiperCaptionAnimation(swiper);
            },
            onInit: function (swiper) {
              toggleSwiperInnerVideos(swiper);
              toggleSwiperCaptionAnimation(swiper);

              initLightGallry($(swiper.container).parent(), 'lightGallery-in-carousel');

              $window.on('resize', function () {
                swiper.update(true);
              })
            }
          });

        $window
          .on("resize", function () {
            var mh = getSwiperHeight(s, "min-height"),
              h = getSwiperHeight(s, "height");
            if (h) {
              s.css("height", mh ? mh > h ? mh : h : h);
            }
          })
          .trigger("resize");
      }
    }


    /**
     * Owl carousel
     * @description Enables Owl carousel plugin
     */
    if (plugins.owl.length) {
      var i;
      for (i = 0; i < plugins.owl.length; i++) {
        var c = $(plugins.owl[i]);
        //skip owl in bootstrap tabs
        if (!c.parents('.tab-content').length) {
          initOwlCarousel(c);
        }
      }
    }

    /**
     * Isotope
     * @description Enables Isotope plugin
     */
    if (plugins.isotope.length) {
      var i, isogroup = [];
      for (i = 0; i < plugins.isotope.length; i++) {
        var isotopeItem = plugins.isotope[i],
          iso = new Isotope(isotopeItem, {
            itemSelector: '.isotope-item',
            layoutMode: isotopeItem.getAttribute('data-isotope-layout') ? isotopeItem.getAttribute('data-isotope-layout') : 'masonry',
            filter: '*'
          });

        isogroup.push(iso);
      }

      $window.on('load', function () {
        setTimeout(function () {
          var i;
          for (i = 0; i < isogroup.length; i++) {
            isogroup[i].element.className += " isotope--loaded";
            isogroup[i].layout();
          }
        }, 600);
      });

      var resizeTimout,
        isotopeFilter = $("[data-isotope-filter]");

      isotopeFilter.on("click", function (e) {
        e.preventDefault();
        var filter = $(this);
        clearTimeout(resizeTimout);
        filter.parents(".isotope-filters").find('.active').removeClass("active");
        filter.addClass("active");
        var iso = $('.isotope[data-isotope-group="' + this.getAttribute("data-isotope-group") + '"]');
        iso.isotope({
          itemSelector: '.isotope-item',
          layoutMode: iso.attr('data-isotope-layout') ? iso.attr('data-isotope-layout') : 'masonry',
          filter: this.getAttribute("data-isotope-filter") == '*' ? '*' : '[data-filter*="' + this.getAttribute("data-isotope-filter") + '"]'
        });
      }).eq(0).trigger("click")
    }

    /**
     * WOW
     * @description Enables Wow animation plugin
     */
    if (isDesktop && $html.hasClass("wow-animation") && $(".wow").length) {
      new WOW().init();
    }

    /**
     * Bootstrap tabs
     * @description Activate Bootstrap Tabs
     */
    if (plugins.bootstrapTabs.length) {
      var i;
      for (i = 0; i < plugins.bootstrapTabs.length; i++) {
        var bootstrapTabsItem = $(plugins.bootstrapTabs[i]);

        //If have owl carousel inside tab - resize owl carousel on click
        if (bootstrapTabsItem.find('.owl-carousel').length) {
          // init first open tab

          var carouselObj = bootstrapTabsItem.find('.tab-content .tab-pane.active .owl-carousel');

          initOwlCarousel(carouselObj);

          //init owl carousel on tab change
          bootstrapTabsItem.find('.nav-custom a').on('click', $.proxy(function () {
            var $this = $(this);

            $this.find('.owl-carousel').trigger('destroy.owl.carousel').removeClass('owl-loaded');
            $this.find('.owl-carousel').find('.owl-stage-outer').children().unwrap();

            setTimeout(function () {
              var carouselObj = $this.find('.tab-content .tab-pane.active .owl-carousel');

              if (carouselObj.length) {
                for (var j = 0; j < carouselObj.length; j++) {
                  var carouselItem = $(carouselObj[j]);
                  initOwlCarousel(carouselItem);
                }
              }

            }, isNoviBuilder ? 1500 : 300);

          }, bootstrapTabsItem));
        }

        //If have slick carousel inside tab - resize slick carousel on click
        if (bootstrapTabsItem.find('.slick-slider').length) {
          bootstrapTabsItem.find('.tabs-custom-list > li > a').on('click', $.proxy(function () {
            var $this = $(this);
            var setTimeOutTime = isNoviBuilder ? 1500 : 300;

            setTimeout(function () {
              $this.find('.tab-content .tab-pane.active .slick-slider').slick('setPosition');
            }, setTimeOutTime);
          }, bootstrapTabsItem));
        }
      }
    }


    /**
     * RD Input Label
     * @description Enables RD Input Label Plugin
     */

    if (plugins.rdInputLabel.length) {
      plugins.rdInputLabel.RDInputLabel();
    }


    /**
     * Regula
     * @description Enables Regula plugin
     */

    if (plugins.regula.length) {
      attachFormValidator(plugins.regula);
    }


    /**
     * MailChimp Ajax subscription
     */

    if (plugins.mailchimp.length) {
      for (i = 0; i < plugins.mailchimp.length; i++) {
        var $mailchimpItem = $(plugins.mailchimp[i]),
          $email = $mailchimpItem.find('input[type="email"]');

        // Required by MailChimp
        $mailchimpItem.attr('novalidate', 'true');
        $email.attr('name', 'EMAIL');

        $mailchimpItem.on('submit', $.proxy(function (e){
          e.preventDefault();

          var $this = this;

          var data = {},
            url = $this.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
            dataArray = $this.serializeArray(),
            $output = $("#" + $this.attr("data-form-output"));

          for (i = 0; i < dataArray.length; i++) {
            data[dataArray[i].name] = dataArray[i].value;
          }

          $.ajax({
            data: data,
            url: url,
            dataType: 'jsonp',
            error: function (resp, text) {
              $output.html('Server error: ' + text);

              setTimeout(function () {
                $output.removeClass("active");
              }, 4000);
            },
            success: function (resp) {
              $output.html(resp.msg).addClass('active');

              setTimeout(function () {
                $output.removeClass("active");
              }, 6000);
            },
            beforeSend: function(data){
              // Stop request if builder or inputs are invalide
              if (isNoviBuilder || !isValidated($this.find('[data-constraints]')))
                return false;

              $output.html('Submitting...').addClass('active');
            }
          });

          return false;
        }, $mailchimpItem));
      }
    }


    /**
     * Campaign Monitor ajax subscription
     */

    if (plugins.campaignMonitor.length) {
      for (i = 0; i < plugins.campaignMonitor.length; i++) {
        var $campaignItem = $(plugins.campaignMonitor[i]);

        $campaignItem.on('submit', $.proxy(function (e){
          var data = {},
            url = this.attr('action'),
            dataArray = this.serializeArray(),
            $output = $("#" + plugins.campaignMonitor.attr("data-form-output")),
            $this = $(this);

          for (i = 0; i < dataArray.length; i++) {
            data[dataArray[i].name] = dataArray[i].value;
          }

          $.ajax({
            data: data,
            url: url,
            dataType: 'jsonp',
            error: function (resp, text) {
              $output.html('Server error: ' + text);

              setTimeout(function () {
                $output.removeClass("active");
              }, 4000);
            },
            success: function (resp) {
              $output.html(resp.Message).addClass('active');

              setTimeout(function () {
                $output.removeClass("active");
              }, 6000);
            },
            beforeSend: function(data){
              // Stop request if builder or inputs are invalide
              if (isNoviBuilder || !isValidated($this.find('[data-constraints]')))
                return false;

              $output.html('Submitting...').addClass('active');
            }
          });

          return false;
        }, $campaignItem));
      }
    }



    /**
     * RD Mailform
     * @version      3.2.0
     */
    if (plugins.rdMailForm.length) {
      var i, j, k,
        msg = {
          'MF000': 'Successfully sent!',
          'MF001': 'Recipients are not set!',
          'MF002': 'Form will not work locally!',
          'MF003': 'Please, define email field in your form!',
          'MF004': 'Please, define type of your form!',
          'MF254': 'Something went wrong with PHPMailer!',
          'MF255': 'Aw, snap! Something went wrong.'
        };

      for (i = 0; i < plugins.rdMailForm.length; i++) {
        var $form = $(plugins.rdMailForm[i]),
          formHasCaptcha = false;

        $form.attr('novalidate', 'novalidate').ajaxForm({
          data: {
            "form-type": $form.attr("data-form-type") || "contact",
            "counter": i
          },
          beforeSubmit: function (arr, $form, options) {
            if (isNoviBuilder)
              return;

            var form = $(plugins.rdMailForm[this.extraData.counter]),
              inputs = form.find("[data-constraints]"),
              output = $("#" + form.attr("data-form-output")),
              captcha = form.find('.recaptcha'),
              captchaFlag = true;

            output.removeClass("active error success");

            if (isValidated(inputs, captcha)) {

              // veify reCaptcha
              if(captcha.length) {
                var captchaToken = captcha.find('.g-recaptcha-response').val(),
                  captchaMsg = {
                    'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
                    'CPT002': 'Something wrong with google reCaptcha'
                  }

                formHasCaptcha = true;

                $.ajax({
                  method: "POST",
                  url: "bat/reCaptcha.php",
                  data: {'g-recaptcha-response': captchaToken},
                  async: false
                })
                  .done(function (responceCode) {
                    if (responceCode != 'CPT000') {
                      if (output.hasClass("snackbars")) {
                        output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

                        setTimeout(function () {
                          output.removeClass("active");
                        }, 3500);

                        captchaFlag = false;
                      } else {
                        output.html(captchaMsg[responceCode]);
                      }

                      output.addClass("active");
                    }
                  });
              }

              if(!captchaFlag) {
                return false;
              }

              form.addClass('form-in-process');

              if (output.hasClass("snackbars")) {
                output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
                output.addClass("active");
              }
            } else {
              return false;
            }
          },
          error: function (result) {
            if (isNoviBuilder)
              return;

            var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
              form = $(plugins.rdMailForm[this.extraData.counter]);

            output.text(msg[result]);
            form.removeClass('form-in-process');

            if(formHasCaptcha) {
              grecaptcha.reset();
            }
          },
          success: function (result) {
            if (isNoviBuilder)
              return;

            var form = $(plugins.rdMailForm[this.extraData.counter]),
              output = $("#" + form.attr("data-form-output"));

            form
              .addClass('success')
              .removeClass('form-in-process');

            if(formHasCaptcha) {
              grecaptcha.reset();
            }

            result = result.length === 5 ? result : 'MF255';
            output.text(msg[result]);

            if (result === "MF000") {
              if (output.hasClass("snackbars")) {
                output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
              } else {
                output.addClass("active success");
              }
            } else {
              if (output.hasClass("snackbars")) {
                output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
              } else {
                output.addClass("active error");
              }
            }

            form.clearForm();
            form.find('input, textarea').trigger('blur');

            setTimeout(function () {
              output.removeClass("active error success");
              form.removeClass('success');
            }, 3500);
          }
        });
      }
    }

    /**
     * lightGallery
     * @description Enables lightGallery plugin
     */
    function initLightGallry(wrapperToInit, addClass){
      if (plugins.lightGallery.length && !isNoviBuilder) {
        $(wrapperToInit).find(plugins.lightGallery.selector).lightGallery({
          thumbnail: true,
          selector: "[data-lightgallery='group-item']",
          addClass: addClass
        });
      }

      if (plugins.lightGalleryItem.length && !isNoviBuilder) {
        $(wrapperToInit).find(plugins.lightGalleryItem.selector).lightGallery({
          selector: "this",
          addClass: addClass
        });
      }
    }

    if (plugins.lightGallery.length && !isNoviBuilder) {
      initLightGallry('html');
    }

    if (plugins.lightGalleryItem.length && !isNoviBuilder) {
      initLightGallry('html');
    }

    /**
     * Custom Toggles
     */
    if (plugins.customToggle.length) {
      var i;

      for (i = 0; i < plugins.customToggle.length; i++) {
        var $this = $(plugins.customToggle[i]);

        $this.on('click', $.proxy(function (event) {
          event.preventDefault();
          var $ctx = $(this);
          $($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
        }, $this));

        if ($this.attr("data-custom-toggle-hide-on-blur") === "true") {
          $("body").on("click", $this, function (e) {
            if (e.target !== e.data[0]
              && $(e.data.attr('data-custom-toggle')).find($(e.target)).length
              && e.data.find($(e.target)).length == 0) {
              $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
            }
          })
        }

        if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
          $("body").on("click", $this, function (e) {
            if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length == 0 && e.data.find($(e.target)).length == 0) {
              $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
            }
          })
        }
      }
    }

    /**
     * jQuery Count To
     * @description Enables Count To plugin
     */
    if (plugins.counter.length) {
      var i;

      for (i = 0; i < plugins.counter.length; i++) {
        var $counterNotAnimated = $(plugins.counter[i]).not('.animated');
        $document
          .on("scroll", $.proxy(function () {
            var $this = this;

            if ((!$this.hasClass("animated")) && (isScrolledIntoView($this))) {
              $this.countTo({
                refreshInterval: 40,
                from: 0,
                to: parseInt($this.text(), 10),
                speed: $this.attr("data-speed") || 1000
              });
              $this.addClass('animated');
            }
          }, $counterNotAnimated))
          .trigger("scroll");
      }
    }

    /**
     * TimeCircles
     * @description  Enable TimeCircles plugin
     */
    if (plugins.dateCountdown.length) {
      var i;
      for (i = 0; i < plugins.dateCountdown.length; i++) {
        var dateCountdownItem = $(plugins.dateCountdown[i]);

        $window.on('load resize orientationchange', $.proxy(function () {
          var $this = $(this),
            circleColor = $this.data('circle-inner-color'),
            dateCountdownItemBgColor = $this.data('circle-bg'),
            time = {
              "Days": {
                "text": "Days",
                "color": circleColor,
                "show": true
              },
              "Hours": {
                "text": "Hours",
                "color": circleColor,
                "show": true
              },
              "Minutes": {
                "text": "Minutes",
                "color": circleColor,
                "show": true
              },
              "Seconds": {
                "text": "Seconds",
                "color": circleColor,
                "show": true
              }
            };

          $this.TimeCircles({
            fg_width: $this.data('circle-fg-width') || 0.045,
            circle_bg_color: dateCountdownItemBgColor,
            bg_width: $this.data('circle-bg-width') || 0.9,
            time: time
          });

          if (window.innerWidth < 479) {
            $this.TimeCircles({
              time: {
                Days: {
                  "color": circleColor,
                  "show": true
                },
                Hours: {
                  "color": circleColor,
                  "show": true
                },
                Minutes: {
                  color: circleColor,
                  show: true
                },
                Seconds: {
                  show: false
                }
              }
            }).rebuild();
          } else if (window.innerWidth < 767) {
            $this.TimeCircles({
              time: {
                Days: {
                  "color": circleColor,
                  "show": true
                },
                Hours: {
                  "color": circleColor,
                  "show": true
                },
                Seconds: {show: false}
              }
            }).rebuild();
          } else {
            $this.TimeCircles({time: time}).rebuild();
          }
        }, dateCountdownItem));
      }
    }

    /**
     * Circle Progress
     * @description Enable Circle Progress plugin
     */
    if (plugins.circleProgress.length) {
      var i;
      for (i = 0; i < plugins.circleProgress.length; i++) {
        var circleProgressItem = $(plugins.circleProgress[i]);
        $document
          .on("scroll", $.proxy(function () {
            var $this = $(this);

            if (!$this.hasClass('animated') && isScrolledIntoView($this)) {

              var arrayGradients = $this.attr('data-gradient').split(",");

              $this.circleProgress({
                value: $this.attr('data-value'),
                size: $this.attr('data-size') ? $this.attr('data-size') : 175,
                fill: {gradient: arrayGradients, gradientAngle: Math.PI / 4},
                startAngle: -Math.PI / 4 * 2,
                emptyFill: $this.attr('data-empty-fill') ? $this.attr('data-empty-fill') : "rgb(245,245,245)",
                thickness: $this.attr('data-thickness') ? parseInt($this.attr('data-thickness')) : 10,

              }).on('circle-animation-progress', function (event, progress, stepValue) {
                $(this).find('span').text(String(stepValue.toFixed(2)).replace('0.', '').replace('1.', '1'));
              });
              $this.addClass('animated');
            }
          }, circleProgressItem))
          .trigger("scroll");
      }
    }

    /**
     * Linear Progress bar
     * @description  Enable progress bar
     */
    if (plugins.progressLinear.length) {
      for (i = 0; i < plugins.progressLinear.length; i++) {
        var progressBar = $(plugins.progressLinear[i]);
        $window
          .on("scroll load", $.proxy(function () {
            var bar = $(this);
            if (!bar.hasClass('animated-first') && isScrolledIntoView(bar)) {
              var end = parseInt($(this).find('.progress-value').text(), 10);
              bar.find('.progress-bar-linear').css({width: end + '%'});
              bar.find('.progress-value').countTo({
                refreshInterval: 40,
                from: 0,
                to: end,
                speed: 500
              });
              bar.addClass('animated-first');
            }
          }, progressBar));
      }
    }

    /**
     * Material Parallax
     * @description Enables Material Parallax plugin
     */
    if (plugins.materialParallax.length) {
      var i;

      if (!isNoviBuilder && !isIE && !isMobile) {
        plugins.materialParallax.parallax();
      } else {
        for (i = 0; i < plugins.materialParallax.length; i++) {
          var parallax = $(plugins.materialParallax[i]),
            imgPath = parallax.data("parallax-img");

          parallax.css({
            "background-image": 'url(' + imgPath + ')',
            "background-attachment": "fixed"
          });
        }
      }
    }
  });
}());